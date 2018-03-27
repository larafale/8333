import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import { getContext } from 'recompose'

import Network from './Network'

export default class Footer extends Component {

  render () {

    return (<footer className="py-2 py-lg-4 bg-dark text-light">

      <div className="container">
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <strong>8333.io</strong>
          <span className="d-none d-sm-inline">
             by <a className="text-warning">larafale</a>.
          </span>
        </div>
        <div>
          <Network />
        </div>
      </div>
      </div>


    </footer>)

  }

}