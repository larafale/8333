import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { getContext } from 'recompose'
import { formatBytes } from '../../lib/util'



@getContext({
  io: PropTypes.object
})
export default class Mempool extends Component {

  static defaultProps = {} 
  state = { 
      mempool: {}
  }

  componentDidMount() {
    const { io } = this.props
    io.on('mempool', this.mempoolEvent)
    io.emit('mempool')
  }

  componentWillUnmount() {
    const { io } = this.props
    io.off('mempool', this.mempoolEvent)
  }

  mempoolEvent = mempool => this.setState({ mempool })

  render() {

    const { mempool } = this.state

    return (<div className="">

      <div className="my-4">
        <i className={`fa fa-database`} />
        <strong> Mempool</strong>
      </div>

      <table className="table table-sm table-hover">
        <tbody>
          <tr>
            <th>Tx</th>
            <td className="text-right">{mempool.size}</td>
          </tr>
          <tr>
            <th>Size</th>
            <td className="text-right">{formatBytes(mempool.bytes, 3)}</td>
          </tr>
          <tr>
            <th>Usage</th>
            <td className="text-right">{formatBytes(mempool.usage, 3)}</td>
          </tr>
        </tbody>
      </table>

    </div>)
  }
}



