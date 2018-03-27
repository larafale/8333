import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import _ from 'lodash'
import { getContext } from 'recompose'

import Invoices from './Invoices'
import Invoice from './Invoice'

@getContext({
  server: PropTypes.func,
  serverError: PropTypes.func,
  user: PropTypes.object,
  setPanel: PropTypes.func,
})
export default class InvoicesPanel extends Component {

  constructor(props){
    super(props)

    this.state = { 
        edit: false 
      , wallets: []
    }

    this.editInvoice = this.editInvoice.bind(this)
  }

  componentDidMount() {
    const { server, serverError } = this.props

    server.get(`/wallets`)
      .then(({data}) => this.setState({ wallets: data }))
      .catch(e => {
        serverError(e)
      })
  }

  editInvoice(invoice) {
    this.setState({ edit: invoice || false })
  }

  render() {

    const { setPanel } = this.props
    const { edit, wallets } = this.state

    return (<div className="">

      { !edit && <Invoices wallets={wallets} editInvoice={this.editInvoice} />}
      { edit && <Invoice wallets={wallets} invoice={edit} editInvoice={this.editInvoice} />}

    </div>)

  }

}
