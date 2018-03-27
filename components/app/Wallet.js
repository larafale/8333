import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import _ from 'lodash'
import { getContext } from 'recompose'
import { spinOn, spinOff } from '../../lib/util'
import { Settings as priceInfo, formatPrice } from '../../lib/btc-price'


@getContext({
  server: PropTypes.func,
  serverError: PropTypes.func,
  auth: PropTypes.object,
  user: PropTypes.object,
  setUser: PropTypes.func,
})
export default class Wallet extends Component {

  constructor(props){
    super(props)
    const { wallet, auth } = props

    const form = {
        name: wallet.name || ''
      , xpub: wallet.xpub || ''
      , hook: wallet.hook || ''
      , ticker: wallet.ticker
      , fiat: wallet.fiat
      , confs: wallet.confs
      , expires: wallet.expires
    }

    this.state = { form }

    this.save = this.save.bind(this)
    this.delete = this.delete.bind(this)
  }

  async save(e) {
    const { wallet, editWallet, server, serverError } = this.props
    const { form } = this.state
    const cta = $(e.target)

    spinOn(cta)

    server.put(`/wallets/${wallet.id}`, form)
      .then(({ data }) => editWallet(data))
      .catch(serverError)
      .finally(spinOff(cta))
  }

  async delete(e) {
    const { wallet, editWallet, server, serverError } = this.props
    const { form } = this.state
    const cta = $(e.target)

    spinOn(cta)

    server.delete(`/wallets/${wallet.id}`)
      .then((d) => editWallet(false))
      .catch(serverError)
      .finally(spinOff(cta))
  }

  render () {

    const { editWallet } = this.props
    const { form } = this.state

    const setForm = key => e => {
      this.setState({ form: { ...form, [key]: e.target.value } })
    }

    return (<div className="">

      <div className="d-flex justify-content-between align-items-center flex-row-reverse">
        <div className="more-actions">
          <a className="btn btn-outline-dark dropdown-toggle" data-toggle="dropdown" href="#" role="button">
            <i className="fa fa-cog"/>
            More
          </a>
          <div className="dropdown-menu dropdown-menu-right">
            <a onClick={this.delete} className="dropdown-item" href='javascript:'>
              <i className="fa fa-refresh fa-spin d-none" />
              <i className="fa fa-trash" />
               Delete
            </a>
          </div>
        </div>
        <a onClick={()=>editInvoice(false)} className="btn btn-outline-dark d-lg-none" href='javascript:'>
          <i className="fa fa-arrow-left" />
          Back
        </a>
        <div className="h3 m-0 d-none d-lg-block">{form.name}</div>
      </div>
      <hr/>

      <ul className="nav nav-tabs mb-3" role="tablist">
        <li className="nav-item">
          <a className="nav-link active" data-toggle="tab" href="#tab-1" role="tab">General</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" data-toggle="tab" href="#tab-2" role="tab">Settings</a>
        </li>
      </ul>

      <div className="tab-content">

        <div className="tab-pane fade show active" id="tab-1" role="tabpanel">
          <div className="form-group">
            <label>Name</label>
            <input type="text" onChange={setForm('name')} value={form.name} className="form-control" placeholder="Name" />
          </div>
          <div className="form-group">
            <label>Xpub Key</label>
            <input type="text" onChange={setForm('xpub')} value={form.xpub} className="form-control" placeholder="Key" />
          </div>
          <div className="form-group">
            <label>Hook Url</label>
            <input type="text" onChange={setForm('hook')} value={form.hook} className="form-control" placeholder="http(s)://www.domain.tld/endpoint?foo=bar" />
          </div>
        </div>

        <div className="tab-pane fade" id="tab-2" role="tabpanel">
          <div className="row">
            <div className="form-group col-6">
              <label>Ticker</label>
              <select onChange={setForm('ticker')} value={form.ticker} className="form-control">
                { _.keys(priceInfo.symbols).map((ticker, i) =>
                  <option key={i} value={ticker} >
                    {priceInfo.symbols[ticker].ticker}
                  </option>
                )}
              </select>
            </div>
            <div className="form-group col-6">
              <label>Fiat</label>
              <select onChange={setForm('fiat')} value={form.fiat} className="form-control">
                { _.keys(priceInfo.symbols).filter(i=>(!['btc','mbtc','satoshis'].includes(i))).map((ticker, i) =>
                  <option key={i} value={ticker}>
                    {priceInfo.symbols[ticker].ticker}
                  </option>
                )}
              </select>
            </div>
          </div>
          <div className="row">
            <div className="form-group col-6">
              <label >
                Confirmations 
                <i className="fa fa-info-circle" rel="tooltip" data-toggle="tooltip" data-html="true" data-title="<small class='d-inline-block'>Blocks needed before<br>invoice change to 'confirmed'</small>" />
              </label>
              <select onChange={setForm('confs')} value={form.confs} className="form-control">
                { [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((conf, i) =>
                  <option key={i} value={conf} >
                    {conf == 0 ? 'instant (zero confirmation)' : `${conf}`}
                  </option>
                )}
              </select>
            </div>
            <div className="form-group col-6">
              <label>
                Expires 
                <i className="fa fa-info-circle" rel="tooltip" data-toggle="tooltip" data-html="true" data-title="<small class='d-inline-block'>Number of minutes before<br>invoice change to 'expired'.<br/>min = 10, max = 1440 (24h)</small>" />
              </label>
              <input type="number" onChange={setForm('expires')} value={form.expires} step="1" min="10" max="1440" className="form-control" placeholder="x minutes" />
            </div>
          </div>

        </div>
      </div>

      <div className="mt-5">
        <hr/>
        <div className="d-flex justify-content-between">
          <a onClick={()=>editWallet(false)} className="btn btn-outline-dark mr-2" href='javascript:'>
            <i className="fa fa-arrow-left" />
            Back
          </a>
          <a onClick={this.save} className="btn btn-warning" href='javascript:'>
            <i className="fa fa-refresh fa-spin d-none" />
            <i className="fa fa-pencil" />
            Save
          </a>
        </div>
        {/*<a onClick={this.delete} className="btn btn-outline-danger" href='javascript:'>
          <i className="fa fa-refresh fa-spin d-none" />
          <i className="fa fa-trash" />
          Delete
        </a>*/}
      </div>

      <style jsx>{`
        .more-actions .dropdown-toggle::after, .more-actions .dropdown-toggle::before {
          display: none;
        }
      `}</style>  

    </div>)

  }

}
