import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import { getContext } from 'recompose'


export default class Footer extends Component {

  render () {

    return (<footer className="py-2 py-lg-4 bg-dark text-light">

      <div className="container">
        <div className="">
          <strong>8333.io</strong> by 
          <a className="text-warning">larafale</a>.
        </div>
      </div>

      <style jsx>{`
        // .footer {
        //   position: absolute;
        //   right: 0;
        //   bottom: 0;
        //   left: 0;
        // }
      `}</style>
    </footer>)

  }

}