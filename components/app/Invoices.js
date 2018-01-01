import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import _ from 'lodash'
import { getContext } from 'recompose'




@getContext({
  server: PropTypes.func,
  serverError: PropTypes.func,
})
export default class Invoices extends Component {

  constructor(props){
    super(props)
    this.state = { invoices: [] }
    this.add = this.add.bind(this)
  }

  componentDidMount() {
    const { server, serverError } = this.props

    server.get(`/invoices`)
      .then(({data}) => this.setState({ invoices: data }))
      .catch(e => {
        serverError(e)
      })
  }

  async add(e) {
    const { editInvoice, server, serverError } = this.props
    const { form } = this.state
    const cta = $(e.target)

    server.post(`/invoices`)
      .then(({data}) => editInvoice(data))
      .catch(serverError)
  }

  render() {

    const { editInvoice } = this.props
    const { invoices } = this.state

    return (<div className="">

      <a onClick={this.add} className="btn btn-outline-dark pull-right" href='javascript:'>
        <i className="fa fa-plus" />
        Add
      </a>

      <h2 className="title">Invoices</h2>
      <hr/>

      <table className="table table-hover">
        <thead>
          <tr>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
        { invoices.map((s, i) =>
          <tr onClick={()=>editInvoice(s)} key={i} className="cursor">
            <td>{s.id}</td>
          </tr>
        )}
        </tbody>
      </table>


      <style jsx>{`
          
      `}</style>  

    </div>)

  }

}