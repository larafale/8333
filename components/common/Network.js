import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import { getContext } from 'recompose'


@getContext({
    network: PropTypes.string
  , setNetwork: PropTypes.func
}) 
export default class Network extends Component {

  render() {

    const { network, setNetwork } = this.props

    const style = {
        mainnet: network == 'testnet' ? 'btn-outline-warning' : 'btn-warning'
      , testnet: network == 'testnet' ? 'btn-warning' : 'btn-outline-warning'
    }

    return (<div className="">

      <div className="btn-group" role="group">
        <button onClick={()=>setNetwork('mainnet')} type="button" className={`btn btn-sm btn-warning ${style.mainnet}`}>mainnet</button>
        <button onClick={()=>setNetwork('testnet')} type="button" className={`btn btn-sm btn-warning ${style.testnet}`}>testnet</button>
      </div>
      
      <style jsx>{`
        .btn-group {
          height: 26px;
        }
        button {
          width: 80px;
          cursor: pointer;
          line-height: 0px;
        }
      `}</style>

    </div>)
  }
}


