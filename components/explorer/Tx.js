import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { getContext } from 'recompose'
import Pile from '../../lib/pile'
import { copy2clipboard, RxfromIO } from '../../lib/util'


@getContext({
  io: PropTypes.object
})
export default class Tx extends Component {

  static defaultProps = {} 
  state = { 
      txs: Pile(8, [])
    , rate: 0
    , pause: false 
  }

  componentDidMount() {
    const { io } = this.props

    this.tx = RxfromIO(io, 'tx') 
    this.startStream()
  }

  componentWillUnmount() {
    this.stopStream()
  }

  startStream = () => {
    // tx stream
    this.$txs = this.tx.subscribe(tx => {
      this.state.txs.unshift(tx)
    })
 
    // tx per seconds
    this.$rate = this.tx
      .bufferTime(1000)   
      .map(txs => Math.round(txs.length * 100) / 100) 
      .subscribe(r => this.setState({ rate: r }))
  }
  
  stopStream = () => {
    this.$txs.unsubscribe() 
    this.$rate.unsubscribe()
  }

  toggleStream = () => {
    this.state.pause ? this.startStream() : this.stopStream()
    this.setState(s => ({ pause: !s.pause }))
  }

  render() {

    const { txs, rate, pause } = this.state
    const icon = pause ? 'fa-play-circle' : 'fa-pause-circle'

    return (<div className="">

      <div className="my-4">
        <i className={`fa fa-cubes`} />
        <strong> Transactions</strong>
        <small> ({rate} tx/s)</small>
        <i className={`fa ${icon} pull-right cursor`} onClick={this.toggleStream} />
      </div>

      <table className="table table-sm table-hover">
        <thead>
          <tr>
            <th className="d-none d-md-table-cell">hash</th>
            <th className="d-md-none">hash</th>
            <th className="text-right">in/out</th>
          </tr>
        </thead>
        <tbody>
        { txs.map((tx, i) =>
          <tr key={i} onClick={()=>copy2clipboard(tx.hash)} className="cursor">
            <td className="d-none d-md-table-cell"><small>{tx.hash}</small></td>
            <td className="d-md-none"><small>{tx.hash.substr(0, 25)+'...'}</small></td>
            <td className="text-right">{tx.ins}/{tx.outs}</td>
          </tr>
        )}
        </tbody>
      </table>

    </div>)
  }
}


