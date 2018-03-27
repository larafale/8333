import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import { getContext } from 'recompose'
import moment from 'moment'
import QRCode from 'qrcode.react'
import { priceTable } from '../common/Prices'
import { Settings as priceInfo, formatPrice } from '../../lib/btc-price'
import { timeDistance  } from '../../lib/date'
import { SpinnerBox } from '../common/Spinner'


const env = process.env.NODE_ENV

const postMessage = data => window.top.postMessage(data, '*')
const inIframe = () => { try { return window.self !== window.top } catch(e) { return true } }


// <Widget 
//   id={'Syw_qgYUz'} 
//   theme="light" 
//   onLoad={()=>{})}
//   onStatus={(invoice)=>{})}
//   status="" 
//   sockets={false} 
// />


@getContext({
    url: PropTypes.object
  , io: PropTypes.object
  , server: PropTypes.func
  , serverError: PropTypes.func
}) 
export default class Widget extends Component {

  constructor(props) {
    super(props)
    const { url } = this.props
    const invoiceId = url.query.id || this.props.id


    this.state = { 
        invoiceId
      , invoice: props.invoice || {}
      , wallet: props.wallet || {}
      , theme: (url.query.theme || props.theme) == 'light' ? 'light' : 'dark' 
      , tip: props.tip || { height: 0, ts: 0 } // used to calc next block estimate 
      , mounted: false
      , hasParent: false // iframe context
    }
  }

  componentWillReceiveProps(nextProps) {
    const { status } = nextProps
    const { invoice } = this.state

    if(status && status != invoice.status){
      this.setState({ invoice: { ...invoice, status }})
    }
  }

  async componentDidMount() {
    const { io, server, serverError, onLoad, sockets } = this.props
    let { invoiceId, invoice, wallet } = this.state

    try{
      if(!invoice.id) invoice = (await server.get(`/invoices/${invoiceId}`)).data
      if(!wallet.id) wallet = (await server.get(`/wallets/${invoice.wid}`)).data
      
      this.setState({ invoice, wallet, mounted: true, hasParent: inIframe() })
      onLoad && onLoad()

      if(sockets !== false){
        io.on('tip', this.tipEvent)
        io.emit('tip')

        // listen for update & refresh invoice
        io.on(invoice.id, this.invoiceEvent)
      }
    }catch(e){ 
      serverError(e) 
    }
  }
  
  componentWillUnmount() {
    const { io, sockets } = this.props
    const { invoice } = this.state

    if(sockets !== false){
      io.off(invoice.id, this.invoiceEvent)
      io.off('tip', this.tipEvent)
    }
  }

  invoiceEvent = async data => {
    console.log('[invoice] update', data)
    postMessage(data) // notify parent
    const { server, onStatus } = this.props
    const freshInvoice = (await server.get(`/invoices/${this.state.invoice.id}`)).data
    this.setState({ invoice: freshInvoice })
    onStatus && onStatus(freshInvoice)
  }

  tipEvent = tip => {
    console.log('tip event', tip)
    setTimeout(()=>this.setState({ tip }), 0)
  }


  render() {

    const { mounted, hasParent, invoice, wallet, theme, tip } = this.state
    const { price, status, tx } = invoice

    const btcScheme = i => (`bitcoin:${i.address}?amount=${i.price.btc||0}`)
    const theme_reverse = theme=='dark'?'light':'dark'
    const css = `bg-${theme} text-${theme_reverse}`

    const switchStatus = status => {
      this.setState({ invoice: { ...invoice, status } })
    }


    return (<div className="">

      { !mounted && <SpinnerBox />}

      { mounted && invoice.id && <div className={`widget ${theme} ${css} mx-auto noselect`}>

        <div className="p-3">

          { hasParent && <div onClick={()=>postMessage('close')} className="close-widget d-flex justify-content-center align-items-center cursor">
            <i className="fa fa-times" />
          </div>}

          <div className={`${price.ts?'d-flex justify-content-between':'text-center'} font-weight-bold mb-4`}>
            <div>{wallet.name}</div>
            <div rel="tooltip" data-toggle="tooltip" data-html="true" data-placement="bottom" data-title={priceTable(price)}>{price.fiat_formated}</div>
          </div>

          { status == 'pending' && <div className="text-center animated zoomInDown">
            <Status invoice={invoice} tip={tip} theme={theme} />
            <Expires switchStatus={switchStatus} start={invoice.cat} end={invoice.eat} />
            <div className="h4 mb-3 mt-4">
              {`Send ${formatPrice(price.btc, 'btc')||'BTC'}`}
            </div>
            <QRCode size={128} bgColor={theme=='dark'?'#343a40':'#f8f9fa'} fgColor={theme=='dark'?'#ffc107':'#343a40'} value={btcScheme(invoice)} />
            <div className="address text-secondary mt-2 selectable">{invoice.address}</div>
            
            <div className="mt-4 text-center">
              <a href='javascript:' onClick={()=>{ window.location = btcScheme(invoice) }} className={`btn btn-outline-${theme_reverse}`}>
                Open in wallet
              </a>
            </div>
          </div>}
            
          { status == 'received' && <div className="text-center animated flipInX">
            <i className={`fa fa-shield icon-xl text-warning`}/>
            <div className="h4 my-4">Securing payment</div>
            <Status invoice={invoice} tip={tip} theme={theme} />
            <NextBlock tip={tip} />
          </div>}

          { status == 'confirmed' && <div className="text-center animated flipInY">
            <i className={`fa fa-check-circle icon-xl`} style={{color:'rgb(91, 232, 107)'}}/>
            <div className="h4 my-4">Payment success</div>
            <div className="mt-5 text-center">
              <a onClick={()=>switchStatus('details')} href='javascript:' className={`btn btn-outline-${theme_reverse}`}>
                View Receipt
              </a>
            </div>
          </div>}

          { status == 'details' && <div className="text-center animated flipInY">
            <i className={`fa fa-info-circle icon-md text-warning my-3`}/>
            <div className="text-left px-3">
              <div className="detail-item d-flex">
                <div>
                  <div>Amount</div>
                  <span className="text-secondary selectable">{formatPrice(tx.satoshis, 'satoshis')}</span>
                </div>
                { tx.ts && <div className="ml-4">
                  <div>Date</div>
                  <span className="text-secondary selectable">{(new moment.unix(tx.ts)).utc().format('DD MMM YYYY @ HH:mm [Z]')}</span>
                </div>}
              </div>
              <div className="detail-item">
                <div>Address</div>
                <span className="text-secondary selectable word-wrap font-sm">{invoice.address}</span>
              </div>
              <div className="detail-item">
                <div>Tx hash</div>
                <span className="text-secondary selectable word-wrap font-sm">{tx.txhash}</span>
              </div>
              { tx.height && <div className="detail-item">
                <div>Block hash ({tx.height})</div>
                <span className="text-secondary selectable word-wrap font-sm">{tx.blockhash}</span>
              </div>}
            </div>
          </div>}

          { status == 'expired' && <div className="text-center animated flipInY">
            <i className={`fa fa-exclamation-circle icon-xl text-warning`}/>
            <div className="h4 my-4">Payment expired</div>
          </div>}
        
        </div>
          
        

        { false && <div className="d-flex flex-column text-center" style={{position:'absolute',top:0,opacity:0.4}}>
          <a onClick={()=>switchStatus('pending')} className={`btn btn-sm btn-outline-${theme_reverse}`} href="javascript:">A</a>
          <a onClick={()=>switchStatus('received')} className={`btn btn-sm btn-outline-${theme_reverse}`} href="javascript:">B</a>
          <a onClick={()=>switchStatus('confirmed')} className={`btn btn-sm btn-outline-${theme_reverse}`} href="javascript:">C</a>
          <a onClick={()=>switchStatus('expired')} className={`btn btn-sm btn-outline-${theme_reverse}`} href="javascript:">D</a>
          <a onClick={()=>switchStatus('details')} className={`btn btn-sm btn-outline-${theme_reverse}`} href="javascript:">E</a>
        </div>}
        

        <div className={`powered px-3 pb-2 pt-4 d-flex flex-row-reverse justify-content-between`}>
          {/*<div className="expires">{moment(invoice.eat).fromNow()}</div>*/}
          <div>
            powered by 
            <a href="https://www.8333.io" target="_new" className={`text-${theme_reverse}`}>
              <span className="font-weight-bold">8333</span>
              <span className="text-warning font-weight-bold">.io</span>
            </a>
          </div>
          <div className="d-flex flex-column justify-content-center">
            <i onClick={()=>this.setState({ theme: theme_reverse })} className={`fa fa-circle cursor text-${theme_reverse}`} />
          </div>
          {/*<div>#{invoice.id}</div>*/}
        </div>

      </div>}


      
      <style jsx>{`

        .widget {
          border-radius: 4px;
          max-width: 334px;
          // overflow: hidden;
          position: relative;
        }

        .widget.dark {
          border: 3px solid #232323;
        }

        .widget.light {
          border: 3px solid #d4d4d4;
        }

        .expires {
          color: #8c8c8c;
          font-size: 13px;
        }
        
        .address {
          font-size: 13px;
        }

        .powered {
          font-size: 14px;
        }

        .detail-item {
          font-size: 13px;
          margin-top: 12px;
        }

        .close-widget {
          position: absolute;
          left: calc(50% - 12px);
          top: -13px;
          background: white;
          border-radius: 20px;
          width: 24px;
          height: 24px;
          font-size: 10px;
          border: 2px solid #343a40;
          color: #343a40;
        }

        .widget.light .close-widget{
          border: 2px solid #e4e4e4;
          color: #8e8e8e;
        }

        .font-sm { font-size: 12px; }
      `}</style>

    </div>)
  }
}



class Counter extends React.Component {
  constructor(props) {
    super(props)
    this.state = { counter: 0 }
  }

  componentDidMount() {
    this.interval = setInterval(()=>{
      this.setState({ counter: this.state.counter + 1 })
    }, 1000)
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }
}


const ProgressBar = ({ value, height = '2px', background = '#555' }) => (<div className="progress mb-1 mx-auto" style={{width: '200px',height: height, backgroundColor: background}}>
  <div className="progress-bar progress-bar-striped progress-bar-animated bg-warning" role="progressbar" style={{width: `${value}%`}}></div>
</div>)


const Status = ({ invoice, tip, theme = "light" }) => {
  const { status, confs, tx } = invoice
  const block = tx.height ? (tx.height + (confs-1)) - tip.height : confs

  return (['pending', 'received'].includes(status) && <div className="text-center ">
    <div className="status p-2">
      <i className={`fa fa-rotate-right ${env=='production'?'fa-spin':''} ${theme} mr-2`} />
      { status == 'pending' && <span>waiting for payment</span>}
      { status == 'received' && <span className="animated fadeIn delay-05">
        { block == 1 && `confirming in 1 block` }
        { block == 0 && `confirming payment...` }
        { block > 1 && `confirming in ${block} blocks` }
        { /* this is only used for for showcase */
          block < 0 && `confirming in 1 block` }
      </span>}
    </div>
    <style jsx>{`
      .status { font-size: 14px; }
      i.light { color: #fec108; }
      i.dark { color: #fec108; }
    `}</style>
  </div>)
}


class Expires extends Counter {
  render() {
    const { start, end, switchStatus } = this.props
    const { expired, time_left, time_elapsed, percent } = timeDistance(start, end) 
    // if(expired) switchStatus('expired')
    return (<div>
      <ProgressBar value={percent} />
      <small className="text-secondary">Expires in <span>{time_left}</span></small>
    </div>)
  }
}

class NextBlock extends Counter {
  render() {
    const { tip } = this.props
    const start = moment.unix(tip.ts) // default to now for showcase
    const end = moment(start).add(10, 'minutes')
    const { expired, time_left, time_elapsed, percent } = timeDistance(start, end)
    const text = expired ? 'near' : time_left 
    return (<div className="text-center">
      <ProgressBar value={percent} />
      <small className="text-secondary">next block estimate: <span>{text}</span></small>
    </div>)
  }
}