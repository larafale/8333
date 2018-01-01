import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import { getContext } from 'recompose'

@getContext({
  panel: PropTypes.string,
  setPanel: PropTypes.func,
})
export default class Menu extends Component {

  render () {
    console.log('[menu] render')

    const { panel, setPanel } = this.props

    return (<div className="">

      <div className="">
      <div className="nav flex-column nav-pills">
        <a onClick={()=>setPanel('invoices')} className={`nav-link text-left text-lg-right ${panel=='invoices'&&'active'}`}>
          Invoices
        </a>
        <a onClick={()=>setPanel('shops')} className={`nav-link text-left text-lg-right ${panel=='shops'&&'active'}`}>
          Shops
        </a>
        <a onClick={()=>setPanel('settings')} className={`nav-link text-left text-lg-right ${panel=='settings'&&'active'}`}>
          Settings
        </a>
        <a onClick={()=>setPanel('billing')} className={`nav-link text-left text-lg-right ${panel=='billing'&&'active'}`}>
          Billing
        </a>
      </div>
      </div>

      <style jsx>{`

        .nav-link {
          cursor: pointer;
          margin: 2px 0;
        }

        a:not([href]):not([tabindex]):hover {
          color: #fff;
        }

        .nav-pills .nav-link.active, .nav-pills .nav-link:hover {
          color: #fff;
          background-color: #fec108;
        }

      `}</style>
    </div>)
  }

}
