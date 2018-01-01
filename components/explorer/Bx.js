import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { getContext } from 'recompose'
import { formatBytes, RxfromIO } from '../../lib/util'
import Pile from '../../lib/pile'
import { Observable } from 'rxjs'
import moment from 'moment'


// change time
moment.relativeTimeThreshold('m', 60)



@getContext({
  io: PropTypes.object,
  api: PropTypes.string,
})
export default class Bx extends Component {


  static defaultProps = {} 
  state = { 
      blocks: Pile(5, [])
    , tip: 0
    , pause: false 
  }
    
  async componentDidMount() {
    const { io, api } = this.props

    // subcribe to events
    io.on('tip', this.tipEvent)
    io.emit('tip')

    // load last blocks
    const last_blocks = await (await fetch(`${api}/last_blocks`)).json()
    this.lastBlocksEvent(last_blocks)

    // refresh every X second to update momentjs value
    this.refreshInterval = setInterval(()=>this.setState(s => ({ blocks: s.blocks })), 20000)

    // observable from "block" event
    this.bx = RxfromIO(io, 'block')
    this.startStream()
  }

  componentWillUnmount() {
    const { io } = this.props
    this.stopStream()

    io.off('tip', this.tipEvent)
    io.off('last_blocks', this.lastBlocksEvent) 
    clearInterval(this.refreshInterval)
  }

  tipEvent = tip => setTimeout(()=>this.setState({ tip }), 0)

  lastBlocksEvent = blocks => {
    this.state.blocks.unshift(...blocks) 
  }

  startStream = () => {
    this.$blocks = this.bx.subscribe(bx => {
      this.state.blocks.unshift(bx)
    })
  }
  
  stopStream = () => {
    this.$blocks.unsubscribe() 
  }

  toggleStream = () => {
    this.state.pause ? this.startStream() : this.stopStream()
    this.setState(s => ({ pause: !s.pause }))
  }

  render() {

    const { blocks, pause, tip } = this.state
    const icon = pause ? 'fa-play-circle' : 'fa-pause-circle'


    return (<div className="">

      <div className="my-4">
        <i className={`fa fa-cube`} />
        <strong> Blocks</strong>
        <small> ({tip})</small>
      </div>

      <table className="table table-sm table-hover">
        <thead>
          <tr>
            <th>height</th>
            <th className="d-none d-xl-table-cell">hash</th>
            <th className="d-none d-sm-table-cell">tx</th>
            <th className="text-right">ts</th>
            <th className="text-right d-none d-sm-table-cell">size</th>
          </tr>
        </thead>
        <tbody>
        { blocks.map((bx, i) =>
          <tr key={i} className="cursor">
            <td>{bx.height}</td>
            <td className="d-none d-xl-table-cell"><small>{bx.hash}</small></td>
            <td className="d-none d-sm-table-cell">{bx.tx}</td>
            <td className="text-right">{moment.unix(bx.ts).fromNow()}</td>
            <td className="text-right d-none d-sm-table-cell">{formatBytes(bx.size, 3)}</td>
          </tr>
        )}
        </tbody>
      </table>
        

      <style jsx>{`

      `}</style>

    </div>)
  }
}



