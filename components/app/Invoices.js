import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import _ from 'lodash'
import { getContext } from 'recompose'
import { SpinnerBox } from '../common/Spinner'
import moment from 'moment'
import { spinOn, spinOff } from '../../lib/util'
import { formatPrice } from '../../lib/btc-price'


@getContext({
  server: PropTypes.func,
  serverError: PropTypes.func,
})
export default class Invoices extends Component {

  constructor(props){
    super(props)
    this.state = { mounted: false, invoices: [], ticker: 'btc' }
    this.add = this.add.bind(this)
  }

  componentDidMount() {
    const { server, serverError, wallets } = this.props

    server.get(`/invoices`)
      .then(({data}) => this.setState({ mounted: true, invoices: data }))
      .catch(e => {
        serverError(e)
      })
  }

  switchTicker() {
    const { ticker } = this.state
    const map = {btc:'mbtc',mbtc:'satoshis',satoshis:'fiat',fiat:'btc'}
    this.setState({ ticker: map[ticker] })
  }

  async add(e) {
    const { editInvoice, server, serverError } = this.props
    const cta = $(e.target)
    const data = { sid: $('#wallet_select').val() }

    return editInvoice({})

    // create on the fly
    // spinOn(cta)
    // server.post(`/invoices`, data)
    //   .then(({data}) => editInvoice(data))
    //   .catch(serverError)
    //   .finally(spinOff(cta))
  }

  render() {

    const { editInvoice, wallets } = this.props
    const { mounted, invoices, ticker } = this.state

    const statusColors = {
        pending: 'warning'
      , received: 'primary'
      , confirmed: 'dark'
      , expired: 'danger'
    }

    // const pricePrint = (price = {}, ticker = 'btc') => {
    //    price.fiat_formated) || '-'
    // }

    return (<div className="">

      <div className="d-flex justify-content-between align-items-center flex-row-reverse">
        <div className="d-flex align-items-center">
          {/*<select id="wallet_select" className="form-control">
            { wallets.map((s, i) =>
              <option key={i} value={s.id}>
                {s.name}
              </option>
            )}
          </select>*/}
          <a onClick={this.add} className="btn btn-outline-dark" href='javascript:'>
            <i className="fa fa-refresh fa-spin d-none" />
            <i className="fa fa-plus" />
            Create
          </a>
        </div>
        <div className="h3 m-0 d-none d-lg-block">Invoices</div>
      </div>
      <hr/>

      { !mounted && <SpinnerBox />}

      { mounted && <div>

        <div className="d-flex justify-content-between mb-4">
          <div className="d-flex align-items-center">
            <input type="text" placeholder="search..." className="form-control" />
            <a onClick={this.add} className="btn btn-dark pull-right" href='javascript:'>
              <i className="fa fa-search" />
              Search
            </a>
          </div>
        </div>

        { invoices.length == 0 && <p className="lead">No invoices found.</p>}

        { invoices.length > 0 && <div>
          <table className="table table-hover">
            <thead>
              <tr>
                <th className="d-none d-md-table-cell">ID</th>
                <th className="cursor text-md-right" onClick={()=>this.switchTicker()}>Amount</th>
                <th className="d-none d-sm-table-cell">Status</th>
                <th className="d-none d-xl-table-cell">Wallet</th>
                <th className="text-right">Date</th>
              </tr>
            </thead>
            <tbody>
            { invoices.map((invoice, i) =>
              <tr onClick={()=>editInvoice(invoice)} key={i} className="cursor">
                <td className="d-none d-md-table-cell">{invoice.id}</td>
                <td>
                  <div className="text-md-right">{ 
                       formatPrice(invoice.price.satoshis, 'satoshis', ticker) 
                    || invoice.price.fiat_formated || '-'
                  }</div>
                  <div className="d-sm-none"><small>{invoice.id}</small></div>
                </td>
                <td className="d-none d-sm-table-cell">
                  <span className={`badge badge-${statusColors[invoice.status]}`}>{invoice.status}</span>
                </td>
                <td className="d-none d-xl-table-cell">{(_.find(wallets, w => w.id === invoice.wid) || {}).name}</td>
                <td className="text-right">
                  <div className="d-sm-none">
                    <span className={`badge badge-${statusColors[invoice.status]}`}>{invoice.status}</span>
                  </div>
                  <small>
                    {moment(invoice.cat).format('DD MMM YYYY HH:mm')}
                  </small>
                </td>
              </tr>
            )}
            </tbody>
          </table>

        </div>}
      </div>}


    </div>)

  }

}