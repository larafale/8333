import 'isomorphic-fetch'
import React, { Component, createFactory } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import Io from 'socket.io-client'



export default host => {

  return BaseComponent => class Socket extends Component {

    constructor(props){
      super(props)

      this.state = {
        io: Io(host(props), { 
          transports: ['websocket'] 
        })
      }
    }

    // state = {
    //   io: (window && window.io) || Io(host(this.props), { 
    //     transports: ['websocket'] 
    //   }) 
    // }

    componentWillMount() {
      const { io } = this.state
      io.on('connect', this.connect)
      io.on('disconnect', this.disconnect)
    }

    connect = event => {
      console.log('[io] connected')
    }

    disconnect = event => {
      console.log('[io] diconnected')
    }

    componentWillUnmount() { 
      const { io } = this.state
      io.off('connect', this.connect)
      io.off('disconnect', this.disconnect)
      io.close()
    }

    render() {
      return (<BaseComponent {...this.props} {...this.state} />)
    }
  }

}



