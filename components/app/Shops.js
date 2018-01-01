import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import _ from 'lodash'
import { getContext } from 'recompose'




@getContext({
  server: PropTypes.func,
  serverError: PropTypes.func,
})
export default class Shops extends Component {

  constructor(props){
    super(props)
    this.state = { shops: [] }
    this.add = this.add.bind(this)
  }

  componentDidMount() {
    const { server, serverError } = this.props

    server.get(`/shops`)
      .then(({data}) => this.setState({ shops: data }))
      .catch(e => {
        serverError(e)
      })
  }

  async add(e) {
    const { editShop, server, serverError } = this.props
    const { form } = this.state
    const cta = $(e.target)

    server.post(`/shops`)
      .then(({data}) => editShop(data))
      .catch(serverError)
  }

  render() {

    const { editShop } = this.props
    const { shops } = this.state

    return (<div className="">

      <a onClick={this.add} className="btn btn-outline-dark pull-right" href='javascript:'>
        <i className="fa fa-plus" />
        Add
      </a>

      <h2 className="title">Shops</h2>
      <hr/>

      <table className="table table-hover">
        <thead>
          <tr>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
        { shops.map((s, i) =>
          <tr onClick={()=>editShop(s)} key={i} className="cursor">
            <td>{s.name}</td>
          </tr>
        )}
        </tbody>
      </table>


      <style jsx>{`
          
      `}</style>  

    </div>)

  }

}