import 'isomorphic-fetch'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import Error from 'next/error'
import { compose, withState, withContext, getContext } from 'recompose'

import {
    Menu
  , InvoicesPanel
  , ShopsPanel
  , SettingsPanel
  , BillingPanel
} from './'

import {
    Auth
  , BlackBox
} from '../common'

BlackBox


@compose(
    withState('panel', 'setPanel', 'invoices')
  , withContext({  
        panel: PropTypes.string
      , setPanel: PropTypes.func
    }, p => ({
        ...p
    }))
)
@getContext({
  server: PropTypes.func,
  user: PropTypes.object,
  panel: PropTypes.string,
  authed: PropTypes.bool,
})
export default class Application extends Component {

  componentDidMount() {
    const { authed } = this.props
    !authed && $('.body-content').addClass('bg-dark')
  }

  componentWillUnmount() {
    $('.body-content').removeClass('bg-dark')
  }

  render () {

    const { panel, user, authed } = this.props

    return (<div className="">

      { authed && <BlackBox />}

      <div className="container">

        { !authed && <div className="row py-5">
          <Auth />
        </div>}

        
        { authed && <div className="row py-5">
          <div className="col-lg-3">
            <Menu/>
          </div>
          <div className="panel col-lg-9">
            { panel == 'invoices' && <InvoicesPanel /> }
            { panel == 'shops' && <ShopsPanel /> }
            { panel == 'settings' && <SettingsPanel /> }
            { panel == 'billing' && <BillingPanel /> }
          </div>
        </div>}
      
      </div>


      <style jsx>{`

        .panel {
          border-left: 2px solid #fec1084d;
        }

      `}</style>



    </div>)
  }
}

