import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import { getContext } from 'recompose'

@getContext({
  panel: PropTypes.string,
  setPanel: PropTypes.func,
  url: PropTypes.object,
})
export default class Menu extends Component {

  render () {
    // console.log('[menu] render')

    const { panel, setPanel, url } = this.props
    
    return (<div className="">

      <div className="d-lg-none nav flex-row nav-pills mb-3" style={{borderBottom: '1px solid #eee'}}>
        <div className="flex-column w-50 text-center">
          <a onClick={()=>setPanel('invoices')} className={`m-0 p-sm-3 nav-link ${panel=='invoices'&&'active'}`}>
            Invoices
          </a>
          <a onClick={()=>setPanel('wallets')} className={`m-0 p-sm-3 nav-link ${panel=='wallets'&&'active'}`}>
            Wallets
          </a>
        </div>
        <div className="flex-column w-50 text-center">
          <a onClick={()=>setPanel('settings')} className={`m-0 p-sm-3 nav-link ${panel=='settings'&&'active'}`}>
            Settings
          </a>
          <a onClick={()=>setPanel('billing')} className={`m-0 p-sm-3 nav-link ${panel=='billing'&&'active'}`}>
            Billing
          </a>
        </div>
      </div>

      <div className="d-none d-lg-block nav flex-column nav-pills">
        <a onClick={()=>setPanel('invoices')} className={`nav-link text-left text-lg-right ${panel=='invoices'&&'active'}`}>
          Invoices
        </a>
        <a onClick={()=>setPanel('wallets')} className={`nav-link text-left text-lg-right ${panel=='wallets'&&'active'}`}>
          Wallets
        </a>
        <a onClick={()=>setPanel('settings')} className={`nav-link text-left text-lg-right ${panel=='settings'&&'active'}`}>
          Settings
        </a>
        <a onClick={()=>setPanel('billing')} className={`nav-link text-left text-lg-right ${panel=='billing'&&'active'}`}>
          Billing
        </a>
      </div>

      <style jsx>{`

        // a:not([href]):not([tabindex]):hover {
        //   color: #fff;
        // }

        .nav-pills .nav-link{
          cursor: pointer;
          border: 2px solid transparent;
          margin-bottom: 6px;
        }
        .nav-pills .nav-link.active, .nav-pills .nav-link:hover {
          // color: #fff;
          // background-color: #fec108;
          color: #343a40;
          background-color: #efefef75;
          border-radius: 0;
          border: 2px solid #eee;
        }

      `}</style>
    </div>)
  }

}
