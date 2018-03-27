import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { getContext } from 'recompose'
import { Observable } from 'rxjs'
import moment from 'moment'
import url from 'url-parse'




@getContext({
  api: PropTypes.string,
  io: PropTypes.object,
})
export default class Node extends Component {

  static defaultProps = {} 
  state = { 
      node: {}
    , connected: false
  }
    
  componentDidMount() {
    const { io } = this.props
    io.on('connect', this.connect)
    io.on('disconnect', this.disconnect)
    io.on('node', this.nodeEvent)
    io.emit('node')
  }

  componentWillUnmount() {
    const { io } = this.props
    io.off('node', this.nodeEvent)
    io.off('connect', this.connect)
    io.off('disconnect', this.disconnect) 
  }

  connect = event => this.setState({ connected: true })
  
  disconnect = event => this.setState({ connected: false })

  nodeEvent = node => this.setState({ node, connected: true })

  render() {

    const { node, connected } = this.state
    const { api } = this.props
    const bullet = connected ? "✅" : "🔴"


    return (<div className="" hello={this.props.ioid}>

      <div className="my-4">
        <i className={`fa fa-hashtag`} />
        <strong> Node</strong>
      </div>

      <table className="table table-sm table-hover">
        <tbody>
          <tr>
            <th>Status</th>
            <td className="text-right">{bullet}</td>
          </tr>
          <tr>
            <th>Network</th>
            <td className="text-right">{node.network}</td>
          </tr>
          <tr>
            <th>Host</th>
            <td className="text-right">{api || node.host}</td>
          </tr>
        </tbody>
      </table>

    </div>)
  }
}



