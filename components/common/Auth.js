import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import Router from 'next/router'
import _ from 'lodash'
import { getContext } from 'recompose'
import { spinOn, spinOff } from '../../lib/util'
import { SpinnerBox } from './Spinner'


@getContext({
  url: PropTypes.object,
  user: PropTypes.object,
  server: PropTypes.func,
  serverError: PropTypes.func,
  setToken: PropTypes.func,
  authed: PropTypes.bool,
})
export default class Auth extends Component {

  constructor(props){
    super(props)
    const { user } = props

    this.state = { 
        action: 'login'
      , step: 0
      , form: { email: '' }
    }

    this.save = this.save.bind(this)
  }

  componentDidMount() {
    const { authed, url, setToken, server, serverError } = this.props
    const { query } = url


    // css background trick
    $('.body').addClass('bg-dark')
    
    // Login in just a call on /login/:jwt
    // in that case, we reset token & redirect too /app
    if(query.jwt) {
      return server.post(`/auth/token`, { claim: query.jwt })
        .then(({ data }) => {
          setToken(data.jwt, '/app')
          window.history.replaceState('', '', '/app')
        })
        .catch(e => {
          serverError(e)
          this.setState({ step: 1 })
          window.history.replaceState('', '', '/app')
        })
    }

    // remove loading
    this.setState({ step: 1 })
    
    // focus input
    setTimeout(()=>$('input[type="email"]').focus(), 100)
  }

  componentWillUnmount() {
    $('.body').removeClass('bg-dark')
  }

  async save(e) {
    const { user, server, serverError } = this.props
    const { action, form } = this.state
    const cta = $(e.target)

    spinOn(cta)
    server.post(`/auth/${action}`, form)
      .then(({ data }) => {
        console.log(data)
        this.setState({ step: 2 })
      })
      .catch(e => {
        spinOff(cta)()
        serverError(e)
      })
  }

  render () {

    const { user, url, auth } = this.props
    const { form, action, step } = this.state

    const setForm = key => e => {
      this.setState({ form: { ...form, [key]: e.target.value } })
    }

    const style = {
        login: action == 'signup' ? 'btn-outline-light' : 'btn-light'
      , signup: action == 'signup' ? 'btn-light' : 'btn-outline-light'
    }

    const switchAction = action => {
      this.setState({ action })
      $('input[type="email"]').focus()
    }

    return (<div className="container">

      <div className="mx-auto col-12 col-md-5 col-lg-3 mt-lg-5 pt-lg-5">
        
        { step == 0 && <SpinnerBox />}

        { step == 1 && <div className="">
          <div className="form-group text-center">
            <div className="btn-group d-block" role="group">
              <button onClick={()=>switchAction('login')} type="button" className={`w-50 btn ${style.login}`}>login</button>
              <button onClick={()=>switchAction('signup')} type="button" className={`w-50 btn ${style.signup}`}>signup</button>
            </div>
          </div>
          <div className="form-group">
            <input type="email" onChange={setForm('email')} value={form.email} className="form-control" placeholder="Email" />
          </div>
          <div className="d-flex flex-row-reverse">
            <a onClick={this.save} className="btn btn-outline-light w-100" href='javascript:'>
              <i className="fa fa-refresh fa-spin d-none" />
              Request Access
            </a>
          </div>
        </div>}

        { step == 2 && <div className="text-center animated flipInX">
          <i className={`fa fa-envelope-o icon-success text-warning`}/>
          <div className="h4 mt-3 text-light">Check your inbox!</div>
        </div>}

      </div>

      <style jsx>{`

        .icon-success {
          font-size: 80px;
        }

      `}</style>
    </div>)

  }

}