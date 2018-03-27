import 'isomorphic-fetch'
import React, { Component } from 'react'
import Router from 'next/router'
import PropTypes from 'prop-types'
import Link from 'next/link'
import Error from 'next/error'
import { compose, withState, withContext, getContext } from 'recompose'

import {
    Menu
  , InvoicesPanel
  , WalletsPanel
  , SettingsPanel
  , BillingPanel
} from './'

import {
    Auth
  , BlackBox
} from '../common'

BlackBox


@compose(
    withState('panel', 'setPanel', '')
  , withContext({  
        panel: PropTypes.string
      , setPanel: PropTypes.func
    }, p => ({
        ...p
      , setPanel: panel => {
          p.setPanel(panel)
          Router.push(`/app?page=app&panel=${panel}`, `/app/${panel}`, { shallow: true })
        }
    }))
)
@getContext({
  server: PropTypes.func,
  user: PropTypes.object,
  panel: PropTypes.string,
  auth: PropTypes.object,
  authed: PropTypes.bool,
  url: PropTypes.object,
})
export default class Application extends Component {

  componentDidMount(){
    const { authed } = this.props
    !authed && $('.body').addClass('bg-dark')
  }

  constructor(props){
    super(props)
    const { url, setPanel } = props
    const { query } = url
    setPanel(query.panel || 'invoices')
  }

  render () {
    // console.log(this.props)
    const { panel, user, authed, auth } = this.props

    return (<div className="">

      { auth.role == 'root' && <BlackBox />}

      <div className="container">

        { !authed && <div className="row py-5">
          <Auth />
        </div>}

        
        { authed && <div className="row py-0 py-lg-5">
          <div className="panel col-lg-3 p-0 p-lg-3">
            <Menu/>
          </div>
          <div className="col-lg-9">
            { panel == 'invoices' && <InvoicesPanel /> }
            { panel == 'wallets' && <WalletsPanel /> }
            { panel == 'settings' && <SettingsPanel /> }
            { panel == 'billing' && <BillingPanel /> }
          </div>
        </div>}
      
      </div>


      <style jsx>{`

        @media (min-width: 992px){
          .panel {
            border-right: 2px solid #eee;
          }
        }

      `}</style>



    </div>)
  }
}

