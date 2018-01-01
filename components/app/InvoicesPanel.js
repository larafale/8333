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

    this.state = { edit: false }

    this.editInvoice = this.editInvoice.bind(this)
  }

  componentDidMount() {
    const { server, serverError } = this.props

    // server.get(`/invoices`)
    //   .then(({data}) => this.setState({ invoices: data }))
    //   .catch(e => {
    //     serverError(e)
    //   })

  }

  editInvoice(invoice) {
    this.setState({ edit: invoice || false })
  }

  render() {

    const { setPanel } = this.props
    const { edit } = this.state

    return (<div className="">

      { !edit && <Invoices editInvoice={this.editInvoice} />}
      { edit && <Invoice invoice={edit} editInvoice={this.editInvoice} />}

      <style jsx>{`
          
      `}</style>  

    </div>)

  }

}
