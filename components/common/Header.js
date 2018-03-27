import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import Router from 'next/router'
import { getContext } from 'recompose'

import UserMenu from './UserMenu'

@getContext({
  network: PropTypes.string,
  url: PropTypes.object,
  authed: PropTypes.bool,
  setToken: PropTypes.func,
})
export default class Header extends Component {

  componentDidMount(){
    // $(".dropdown-toggle").dropdown()
  }

  render () {

    const { network, url, authed, setToken } = this.props
    const page = url.query.page

    return (<div className="bg-dark">

      <div className="container">

        <nav className="navbar navbar-expand-sm navbar-dark px-0">
          <div className="logo navbar-brand cursor font-weight-bold">
            <Link href="/app?page=site" as="/">
              <div>
             8333<span className="text-warning">.io</span><i className="fa fa-btc d-none" />
             { false && network == 'testnet' && <small className="text-danger"> [{network}]</small>}
              </div>
            </Link>
          </div>

          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbar">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbar">
            <ul className="navbar-nav ml-auto">
              <li className={`nav-item ${page=='explorer'&&'active'}`}>
                <Link href="/app?page=explorer" as="/explorer">
                  <a className="nav-link">Explorer</a>
                </Link>
              </li>
              <li className={`nav-item ${page=='docs'&&'active'}`}>
                <Link href="/app?page=docs" as="/docs">
                  <a className="nav-link">Docs</a>
                </Link>
              </li>
              <li className={`nav-item ${page=='app'&&'active'}`}>
                <Link href="/app?page=app&panel=invoices" as="/app">
                  <a className="nav-link">
                    { authed ? 'Dashboard' : 'Dashboard' }
                  </a>
                </Link>
              </li>
              { authed && <li className="nav-item d-flex align-items-center cursor">
                <a title="sign out" onClick={()=>setToken('')} className="nav-link d-flex">
                  <i className="fa fa-sign-out" />
                </a>
              </li>}
            </ul>
          </div>
        </nav>  

      </div>  


      <style jsx>{`

        .nav-item { margin: 0 10px; }
        // .nav-item:first-child { margin-left: 0; }
        .nav-item:last-child { margin-right: 0; }

        .navbar-light .navbar-toggler, .navbar-dark .navbar-toggler {
          color: rgba(0, 0, 0, 0.5);
          outline: none;
          border: none;
          padding: 0;
          font-size: 16px;
          cursor: pointer;
        }

      `}</style>
    </div>)

  }

}