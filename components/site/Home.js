import React, { Component } from 'react'
import Script from 'react-load-script'
import Widget from '../widget/index.js'
import moment from 'moment'
import Steper from '../common/Steper.js'


const snippet = `<html>
  <head>
    <script src="/widget.js"></script>
  </head>
  <body>
    <script type="text/javascript">
      var invoiceId = fetchFromServer()
      var invoice = Widget(invoiceId)

      invoice.on('data', function(data){
        data.status // pending
      })
    </script>

    <a href="#" onclick="invoice.open()">
      Pay invoice
    </a>
  </body>
</html>`

const fakeWallet = {
  "id": "x",
  "name": "The Moon ☾ Shop",
  "ticker": "mbtc",
  "fiat": "eur",
}

const fakeInvoice = {
  "id": "x",
  "status": "confirmed",
  "confs": 1,
  "eat": new Date("2018-01-31T22:36:16.981Z"),
  "cat": new Date("2018-01-31T22:19:16.981Z"),
  "address": "1QGvKNozPkQRpdNcSz2q5fUWEQASHciZLt",
  "price": {
    "satoshis": 9000000,
    "btc": 0.09,
    "mbtc": 90,
    "fiat": 72835,
    "unit": 809288,
    "fiat_formated": "728,35€",
    "unit_formated": "8.092,88€",
    "ticker": "satoshis",
    "fiat_ticker": "eur",
    "ts": 1517437187830
  },
  "tx": {
    "satoshis": 9000000,
    "index": 0,
    "txhash": "787bd71de4ac28063e1f85533019e36128b33e7c94a4a7654cc74a382bfb59e5",
    "blockhash": "00000000000001806d0ed0f6c6ca796de1e49950aebbe06ba414145a4654c0d0",
    "ts": 1517437345,
    "height": 1
  }
}


const highlight = () => {
 $('pre code').each(function(i, block) {
    hljs.highlightBlock(block)
  })
}

export default class Home extends Component {

  state = { 
      widgetReady: false
    , widgetStatus: 'pending'
  }

  componentDidMount() {}


  render() {

    const { widgetReady, widgetStatus } = this.state
    const statuses = ['pending','received','confirmed']

    const onWidget = () => {
      this.setState({ widgetReady: true })
    }

    const onStatus = (status) => {
      this.setState({ widgetStatus: status })
      $('.snippet .hljs-comment').html(`// ${status}`)
    }


    return (<div>

      <div className="bg-dark py-5">

        <div className="container">
          <div className="row">
            <div className="col-12 text-center">
              <h2 className="text-light m-5 pb-5">Simple web integration</h2>
              
              <p className="lead text-light">
                8333 is not a company, 8333 is cypherpunk. By using our services you agree to nothing but yourself. We don't have time for bureaucracy. We are passionate programmers who think Bitcoin matters. We want to deliver quality Bitcoin tooling for the web emphasizing on security and simplicity. Our platform is trustless, meaning you are 100% in control of your funds without sharing any private keys. The only information needed is an email (8333 is a passwordless service, the only way to login is via email) and a compatible Bip32 extended public key, aka xpubkey, to let wallets generate addresses.
              </p>
            </div>
          </div>
        </div>
       

        <div className="container">
          <div className="row">
            <div className="col-12 text-center">
              <h2 className="text-light mt-5">UX included</h2>
              <div className="line mb-4" style={{width: '100px'}} />
              <p className="lead text-light pb-5">Every invoice you create has a public link</p>
              <div className="px-5 mx-auto my-5" style={{maxWidth:'400px'}}>
                <Steper 
                  step={statuses.indexOf(widgetStatus)} 
                  steps={statuses} 
                  title={(step, i)=>`${step}`}
                  onStep={step=>{ onStatus(step) }} 
                />
              </div>
            </div>
            <div data-aos="fade-right" data-aos-anchor-placement="top-center" className="col-12 col-md-6 d-flex justify-content-center align-items-center">
              <div className={`${widgetReady?'d-none d-md-block':'d-none'}`}>
                <div className="snippet">
                  <pre><code style={{color: 'white'}}>{snippet}</code></pre>
                </div>
              </div>
            </div>
            <div data-aos="fade-left" data-aos-anchor-placement="top-center" className="col-12 col-md-6">
              <Widget 
                status={widgetStatus} 
                onLoad={onWidget.bind(this)}
                invoiceId='x' 
                invoice={fakeInvoice}
                tip={{ height: 0, ts: new moment().add(-7,'m').unix() }}
                wallet={fakeWallet}
                theme="light" 
                id={'x'} 
                sockets={false} />
            </div>
          </div>
        </div>
      
      </div>
      <div className="bg-light py-5">

        <div className="container">
          <div className="row">
            <div className="col-12 text-center">
              <h2 className="mt-5">Simple web integration</h2>
              <div className="line mb-4" />
              <p className="lead">
                8333 is not a company, 8333 is cypherpunk. By using our services you agree to nothing but yourself. We don't have time for bureaucracy. We are passionate programmers who think Bitcoin matters. We want to deliver quality Bitcoin tooling for the web emphasizing on security and simplicity. Our platform is trustless, meaning you are 100% in control of your funds without sharing any private keys. The only information needed is an email (8333 is a passwordless service, the only way to login is via email) and a compatible Bip32 extended public key, aka xpubkey, to let wallets generate addresses.
              </p>
            </div>
          </div>
        </div>

      </div>

      <Script
        url="//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/highlight.min.js"
        onLoad={highlight}
      />


      <style jsx>{`

        .snippet {
          font-size: 14px;
          font-family: monospace;
        }

        .push { height: 400px; }

        .line { 
          display: inline-block;
          background: #92929221;
          height: 3px;
          width: 200px;
        }

      `}</style>

    </div>)
  }
}
