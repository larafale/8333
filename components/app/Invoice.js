import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import _ from 'lodash'
import { getContext } from 'recompose'
import { spinOn, spinOff } from '../../lib/util'


@getContext({
  server: PropTypes.func,
  serverError: PropTypes.func,
  auth: PropTypes.object,
  user: PropTypes.object,
  setUser: PropTypes.func,
})
export default class Invoice extends Component {

  constructor(props){
    super(props)
    const { invoice, auth } = props

    const form = {
        name: invoice.name || ''
      , xpub: invoice.xpub || ''
    }

    this.state = { form }

    this.save = this.save.bind(this)
    this.delete = this.delete.bind(this)
  }

  async save(e) {
    const { invoice, editInvoice, server, serverError } = this.props
    const { form } = this.state
    const cta = $(e.target)

    spinOn(cta)

    server.put(`/invoices/${invoice.id}`, form)
      .then(({ data }) => editInvoice(data))
      .catch(serverError)
      .finally(spinOff(cta))
  }

  async delete(e) {
    const { invoice, editInvoice, server, serverError } = this.props
    const { form } = this.state
    const cta = $(e.target)

    spinOn(cta)

    server.delete(`/invoices/${invoice.id}`)
      .then((d) => editInvoice(false))
      .catch(serverError)
      .finally(spinOff(cta))
  }

  render () {

    const { editInvoice } = this.props
    const { form } = this.state

    const setForm = key => e => {
      this.setState({ form: { ...form, [key]: e.target.value } })
    }

    return (<div className="box">
      <h2 className="title">{form.name}</h2>
      <hr/>

      <div>
        <div className="form-group">
          <label>Name</label>
          <input type="text" onChange={setForm('name')} value={form.name} className="form-control" placeholder="Name" />
        </div>
        <div className="form-group">
          <label>Xpub Key</label>
          <input type="text" onChange={setForm('xpub')} value={form.xpub} className="form-control" placeholder="Key" />
        </div>
        <div className="d-flex justify-content-between">
          <div>
            <a onClick={()=>editInvoice(false)} className="btn btn-outline-dark mr-2" href='javascript:'>
              <i className="fa fa-arrow-left" />
              Back
            </a>
            <a onClick={this.save} className="btn btn-warning" href='javascript:'>
              <i className="fa fa-refresh fa-spin d-none" />
              <i className="fa fa-pencil" />
              Save
            </a>
          </div>
          <a onClick={this.delete} className="btn btn-outline-danger" href='javascript:'>
            <i className="fa fa-refresh fa-spin d-none" />
            <i className="fa fa-trash" />
            Delete
          </a>
        </div>
      </div>

      <style jsx>{`
          
      `}</style>  

    </div>)

  }

}
