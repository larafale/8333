import 'isomorphic-fetch'
import React, { Component } from 'react'
import App from '../components/App.js'
import urlparse from 'url-parse'
import cookiesjs from 'cookies-js'
import cookies from 'cookie'
import jwt from 'jsonwebtoken'


class AppContainer extends Component {

  static async getInitialProps (props) {
    const p = {
        network: ''
      , token: ''
      , api: ''
      , auth: {}
      , authed: false
      , user: {}
    }

    p.token = (process.browser
      ? cookiesjs('app_token')
      : cookies.parse(props.req.headers.cookie || '').app_token)

    // set Network
    p.network = (process.browser
      ? cookiesjs('app_network')
      : cookies.parse(props.req.headers.cookie || '').app_network)
      || 'mainnet'

    // set API url
    p.api = p.network == 'testnet' 
      ? process.env.API_TESTNET 
      : process.env.API_MAINNET
    
    // set User & Auth from jwt
    try{ 
      const auth = jwt.decode(p.token)
      const res = await fetch(`${p.api}/users/${auth.sub}?token=${p.token}`)

      if(res.status === 200){
        p.user = await res.json()
        p.auth = auth
        p.authed = true
      }
    }
    catch(e){ if(p.token) console.log(`Invalid token "${p.token}"`) }

    // we double check real network by querying the api
    p.network = (await (await fetch(`${p.api}`)).json()).network

    // console.log('initial', p)
    return p
  }

  render () {
    return (
      <App {...this.props} />
    )
  }
}

export default AppContainer
