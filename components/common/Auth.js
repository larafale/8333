import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import Router from 'next/router'
import { getContext } from 'recompose'
import { spinOn, spinOff } from '../../lib/util'


@getContext({
  url: PropTypes.object,
  user: PropTypes.object,
  server: PropTypes.func,
  serverError: PropTypes.func,
  setToken: PropTypes.func,
})
export default class Auth extends Component {

  constructor(props){
    super(props)
    const { user } = props

    const form = { email: '' }

    this.state = { form }

    this.save = this.save.bind(this)
  }

  async save(e) {
    const { user, setUser, server, serverError, setToken } = this.props
    const { form } = this.state
    const cta = $(e.target)

    spinOn(cta)

    server.post(`/auth/login`, form)
      .then(({data}) => setToken(data.jwt))
      .catch(e => {
        spinOff(cta)()
        serverError(e)
      })
  }

  render () {

    const { user, url, auth } = this.props
    const { form } = this.state

    const setForm = key => e => {
      this.setState({ form: { ...form, [key]: e.target.value } })
    }

    return (<div className="container">

      <div className="mx-auto col-12 col-md-5 col-lg-3 mt-lg-5 pt-lg-5">
        <div className="form-group">
          <input type="email" onChange={setForm('email')} value={form.email} className="form-control" placeholder="Email" />
        </div>
        <div className="d-flex flex-row-reverse">
          <a onClick={this.save} className="btn btn-warning w-100" href='javascript:'>
            <i className="fa fa-refresh fa-spin d-none" />
            Login
          </a>
        </div>
      </div>

      <style jsx>{`

      `}</style>
    </div>)

  }

}