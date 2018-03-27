import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import _ from 'lodash'
import { getContext } from 'recompose'
import { SpinnerBox } from '../common/Spinner'


@getContext({
  server: PropTypes.func,
  serverError: PropTypes.func,
})
export default class Wallets extends Component {

  constructor(props){
    super(props)
    this.state = { wallets: [], mounted: false }
    this.add = this.add.bind(this)
  }

  componentDidMount() {
    const { server, serverError } = this.props

    server.get(`/wallets`)
      .then(({data}) => this.setState({ mounted: true, wallets: data }))
      .catch(e => {
        serverError(e)
      })
  }

  async add(e) {
    const { editWallet, server, serverError } = this.props
    const { form } = this.state
    const cta = $(e.target)

    server.post(`/wallets`)
      .then(({data}) => editWallet(data))
      .catch(serverError)
  }

  render() {

    const { editWallet } = this.props
    const { mounted, wallets } = this.state

    return (<div className="">

      <div className="d-flex justify-content-between align-items-center flex-row-reverse">
        <a onClick={this.add} className="btn btn-outline-dark" href='javascript:'>
          <i className="fa fa-plus" />
          Add
        </a>
        <div className="h3 m-0 d-none d-lg-block">Wallets</div>
      </div>
      <hr/>

      { !mounted && <SpinnerBox />}

      { mounted && <div>
        
        <table className="table table-hover">
          <thead>
            <tr>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
          { wallets.map((s, i) =>
            <tr key={i} onClick={()=>editWallet(s)} key={i} className="cursor">
              <td>{s.name}</td>
            </tr>
          )}
          </tbody>
        </table>

      </div>}
 

    </div>)

  }

}