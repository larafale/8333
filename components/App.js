import 'isomorphic-fetch'
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
import Appication from './app/App.js'



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
          , params: { token: p.token }
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
      , setToken: t => {
          cookies('app_token', t)
          setTimeout(()=>location.reload(), 0)
        }
    }))
)
@getContext({
  server: PropTypes.func,
  serverError: PropTypes.func,
  auth: PropTypes.object,
  user: PropTypes.object,
})
export default class App extends Component {

  async componentDidMount(){
    console.log('[app] mounted')

    // set network cookie
    cookies('app_network', cookies('app_network') || 'mainnet')
  }

  render() {
    console.log('[app] render')

    const { url, auth } = this.props
    const page = url.query.page

    return (
      <Layout>

        <ToastContainer className={'toast'} autoClose={3000} closeButton={false} position={'bottom-right'} />

        <div className="main-container">
          { page == 'explorer' && <Explorer />}
          { page == 'site' && <Site />}
          { page == 'app' && <Appication />}
        </div>

        <style jsx>{`
          .main-container {
            // background: #fff;
          }
        `}</style>
      </Layout>
    )
  }
}