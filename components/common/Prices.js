

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import { getContext } from 'recompose'
import { Settings as priceInfo, formatPrice } from '../../lib/btc-price'
import moment from 'moment'

@getContext({
  network: PropTypes.string,
  setNetwork: PropTypes.func,
  server: PropTypes.func,
  serverError: PropTypes.func,
}) 
export default class Prices extends Component {

  constructor(props){
    super(props)

    let { amount = '', price = {}, ticker = 'btc', fiatTicker = 'usd' } = props

    amount = priceInfo.fiatTickers.includes(price.ticker) 
      ? price.fiat/100 
      : price[ticker] || amount
    
    ticker = price.ticker || ticker
    fiatTicker = price.fiatTicker || fiatTicker

    this.state = { 
        amount
      , ticker
      , fiatTicker
      , price 
      , loading: false 
      , disabled: false
    }

    this.setTicker = this.setTicker.bind(this)
    this.getPrice = this.getPrice.bind(this)
  }

  setTicker(ticker){
    this.setState({ ticker })
    setTimeout(() => this.getPrice(this.state.amount, 0), 100)
  }

  getPrice(price, throttle = 900){
    const { server, serverError, onPrice } = this.props
    const { amount, ticker, fiatTicker } = this.state

    this.throttle && clearTimeout(this.throttle)
    if(!price) return 

    // return if not > 1
    if(!(Math.abs(parseFloat(price, 10)) > 0)) return

    this.throttle = setTimeout(() => {
      this.setState({ loading: true, price: {} })

      server.get(`/prices/${price}/${ticker}-${fiatTicker}`)
        .then(({ data: price }) => {
          this.setState({ price })
          onPrice && onPrice(price)
        })
        .catch(serverError)
        .finally(() => this.setState({ loading: false }))

    }, throttle)

  }

  render() {

    const { amount, ticker, price, loading, disabled } = this.state
    const { placeholder } = this.props

    const estimate = amount && price.ts 
      ? priceInfo.btcTickers.includes(ticker) 
        ? price.fiat_formated 
        : formatPrice(price.satoshis)
      : false

    const setAmount = e => {
      const amount = e.target.value
      this.setState({ amount })
      this.getPrice(amount)
    }

    return (<div className="">
      <div className="input-group">

        <input disabled={disabled} onChange={setAmount} value={amount} type="number" step="any" min="0" placeholder={placeholder||'amount'} className="form-control" />
        
        <div className="input-group-append">
          <a className={`btn btn-light dropdown-toggle ${disabled&&'disabled'}`} data-toggle="dropdown" href="javascript:">
            {priceInfo.symbols[ticker].ticker}
          </a>
          <div className="dropdown-menu dropdown-menu-right">
            <a className="dropdown-item text-right" onClick={()=>this.setTicker('btc')} href="#">{priceInfo.symbols.btc.ticker}</a>
            <a className="dropdown-item text-right" onClick={()=>this.setTicker('mbtc')} href="#">{priceInfo.symbols.mbtc.ticker}</a>
            <a className="dropdown-item text-right" onClick={()=>this.setTicker('satoshis')} href="#">{priceInfo.symbols.satoshis.ticker}</a>
            <div role="separator" className="dropdown-divider"></div>
            <a className="dropdown-item text-right" onClick={()=>this.setTicker('usd')} href="#">{priceInfo.symbols.usd.ticker}</a>
            <a className="dropdown-item text-right" onClick={()=>this.setTicker('eur')} href="#">{priceInfo.symbols.eur.ticker}</a>
            <a className="dropdown-item text-right" onClick={()=>this.setTicker('jpy')} href="#">{priceInfo.symbols.jpy.ticker}</a>
            <a className="dropdown-item text-right" onClick={()=>this.setTicker('gbp')} href="#">{priceInfo.symbols.gbp.ticker}</a>
            <a className="dropdown-item text-right" onClick={()=>this.setTicker('cad')} href="#">{priceInfo.symbols.cad.ticker}</a>
          </div>
        </div>
        
        { (loading || ((parseFloat(amount, 10) > 0) && estimate)) && <div className="input-group-append">
          <span className="input-group-text estimate noselect">
            { loading && <i className="fa fa-refresh fa-spin" style={{fontSize:'14px'}} />}
            { !loading && <small>≈ {estimate}</small>}
          </span>
          { !loading && <span className="input-group-text noselect bg-light">
            <small><i className="fa fa-info-circle" rel="tooltip" data-toggle="tooltip" data-html="true" data-placement="left" data-title={priceTable(price)} /></small>
          </span>}
        </div>}
      </div>
      
      <style jsx>{`
        .btn-light {
          border-color: #ced4da;
        }

        .estimate {
          background: white;
          border-style: dashed;
        }

        input[disabled] {
          background: #fff;
          cursor: auto;
          -webkit-touch-callout: none;
          -webkit-user-select: none;
          -khtml-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }

        .dropdown-toggle.disabled::after {
          display: none;
        }
      `}</style>

    </div>)
  }
}


export const priceTable = (price) => `
  <table class="table table-sm table-dark table-hover mb-0">
    <tbody>
      <tr>
        <td class="text-left"><label>BTC price</label></td>
        <td class="text-right pr-3"><small>${price.unit_formated}</small></td> 
      </tr>
      <tr>
        <td class="text-left"><label>Time</label></td>
        <td class="text-right pr-3"><small>${(new moment.unix(price.ts/1000)).utc().format('DD MMM YYYY @ HH:mm [Z]')}</small></td>
      </tr>
      <tr>
        <td class="text-left"><label>Fiat</label></td>
        <td class="text-right pr-3"><small>${price.fiat_formated}</small></td>
      </tr>
      <tr>
        <td class="text-left"><label>BTC</label></td>
        <td class="text-right pr-3"><small>${price.btc}</small></td>
      </tr>
      <tr>
        <td class="text-left"><label>mBTC</label></td>
        <td class="text-right pr-3"><small>${price.mbtc}</small></td>
      </tr>
    </tbody>
  </table>
`





