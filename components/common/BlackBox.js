import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import Router from 'next/router'
import { getContext } from 'recompose'
import { spinOn, spinOff } from '../../lib/util'


import Network from './Network'
import UserMenu from './UserMenu'

@getContext({
  network: PropTypes.string,
  url: PropTypes.object,
  user: PropTypes.object,
  auth: PropTypes.object,
  server: PropTypes.func,
  serverError: PropTypes.func,
  setToken: PropTypes.func,
})
export default class BlackBox extends Component {

  constructor(props){
    super(props)
    const { user, auth } = props

    const form = { sub: '' }

    this.state = { form }

    this.save = this.save.bind(this)
  }

  async save(e) {
    const { user, setUser, server, serverError, setToken } = this.props
    const { form } = this.state
    const cta = $(e.target)

    spinOn(cta)

    server.post(`/auth/supertoken`, form)
      .then(({data}) => setToken(data.jwt))
      .catch(serverError)
      .finally(spinOff(cta))
  }

  render () {

    const { network, user, url, auth } = this.props
    const { form } = this.state
    const page = url.query.page

    const setForm = key => e => {
      this.setState({ form: { ...form, [key]: e.target.value } })
    }

    return (<div className="bb bg-light">

      <div className="container">

        <div className="d-flex justify-content-center align-self-stretch">
          <div className="box"><pre>url : {JSON.stringify(url, null, 4)}</pre></div>
          <div className="box"><pre>auth : {JSON.stringify(auth, null, 4)}</pre></div>
          <div className="box"><pre>user : {JSON.stringify(user, null, 4)}</pre></div>
          <div className="box">
            <div className="form">
              <div className="form-group">
                <Network />
              </div>
              <div className="form-group">
                <input type="text" onChange={setForm('sub')} value={form.sub} className="form-control" placeholder="id, email, token" />
              </div>
              <a onClick={this.save} className="btn btn-sm btn-warning" href='javascript:'>
                <i className="fa fa-refresh fa-spin mr-3 d-none" />
                Log As
              </a>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .bb {
          border-bottom: 3px solid #f5f5f5;
          font-size: 14px;
        }

        pre {
          margin-bottom: 0;
        }

        .box {
          padding: 20px;
          margin-right: 0px;
          margin-bottom: 0;
          border-left: 2px dashed #ededed;
        }
        
        .box:last-child {
          margin-right: 0;
          border-right: 2px dashed #ededed;
        }
      `}</style>
    </div>)

  }

}