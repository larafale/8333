import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import { getContext } from 'recompose'

import Tx from './Tx'
import Bx from './Bx'
import Node from './Node'
import Mempool from './Mempool'

import {
    Network
} from '../common'


@getContext({
    network: PropTypes.string
  , setNetwork: PropTypes.func
}) 
export default class Explorer extends Component {


  render() {

    return (<div className="section">

      <div className="container">

        <div className="text-center my-4">
          <Network />
        </div>

        <div className="row">
          <div className="col-12 col-md-6">
            <Node />
          </div>
          <div className="col-12 col-md-6">
            <Mempool  />
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <Bx />
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <Tx /> 
          </div>
        </div>

      </div>


      <style jsx>{`
        .network button {
          width: 80px;
          cursor: pointer;
        }
      `}</style>

    </div>)
  }
}


