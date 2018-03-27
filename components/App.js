require('promise.prototype.finally').shim()
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import moment from 'moment'
import { compose, withState, withContext, getContext } from 'recompose'
import withIo from './hoc/Io'
import cookies from 'cookies-js'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import jwt from 'jsonwebtoken'


import {
    Layout
  , Header
} from './common'

import Explorer from './explorer'
import Site from './site/Home.js'
import Docs from './site/Docs.js'
import Appication from './app/App.js'

import Widget from './widget/index.js'



@compose(
    withIo(p => p.api)
  , withState('page', 'setPage', p => p.url.query.page)
  , withState('user', 'setUser', p => p.user || {})
  , withContext({ 
        url: PropTypes.object 
      , io: PropTypes.object
      , api: PropTypes.string
      , token: PropTypes.string
      , setToken: PropTypes.func
      , server: PropTypes.func        // api http client
      , serverError: PropTypes.func   // server catch() helper
      , auth: PropTypes.object        
      , authed: PropTypes.bool
      , user: PropTypes.object
      , setUser: PropTypes.func
      , page: PropTypes.string
      , setPage: PropTypes.func
      , network: PropTypes.string
      , setNetwork: PropTypes.func
    }, p => ({
        ...p
      , server: axios.create({
            baseURL: p.api
          , params: { apikey: p.token }
          // , withCredentials: false
        })
      , serverError: err => {
          const { response = {} } = err
          const data = response.data || { error: err.message || 'server error' }
          console.log('[server] err', data)
          if(data.error) toast.error(data.error)
          if(data.errors) Object.keys(data.errors).forEach(k => {
            const e = data.errors[k]
            toast.error(e.message || e)
          })
        }
      , setNetwork: n => {
          cookies('app_network', n)
          setTimeout(()=>location.reload(), 0)
        }
      , setToken: (t, redirect) => {
          cookies('app_token', t, { expires: Infinity })
          setTimeout(()=> redirect 
            ? window.location.replace(redirect)
            : window.location.reload()
          , 0)
        }

    }))
)
@getContext({
  server: PropTypes.func,
  serverError: PropTypes.func,
  auth: PropTypes.object,
  user: PropTypes.object,
  api: PropTypes.string,
  network: PropTypes.string,
})
export default class App extends Component {

  constructor(props){
    super(props)
    console.log('[api]', this.props.api)
  }

  async componentDidMount(){
    // console.log('[app] mounted')

    // set network cookie
    cookies('app_network', this.props.network || cookies('app_network') || 'mainnet')

    // delegate popover (broken on ios safari)
    $('body').tooltip({ selector: '[rel="tooltip"]' })

    AOS.init({
      disable: 'mobile',
      // offset: 200,
      // duration: 600,
      // easing: 'ease-in-sine',
      // delay: 100,
    })
  }

  render() {
    console.log('------------------')
    console.log('[app] render')

    const { url, auth } = this.props
    const page = url.query.page
    const framed = page == 'widget'

    return (
      <Layout framed={framed}>

        { page == 'widget' && <div className="py-5"><Widget /></div>}

        <ToastContainer className={'toast'} autoClose={3000} closeButton={false} position={'bottom-right'} />

        { !framed && <div className="main-container animated fadeIn">
          { page == 'explorer' && <Explorer />}
          { page == 'site' && <Site />}
          { page == 'app' && <Appication />}
          { page == 'docs' && <Docs />}
        </div>}

      </Layout>
    )
  }
}