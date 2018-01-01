import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import _ from 'lodash'
import { getContext } from 'recompose'

import Shops from './Shops'
import Shop from './Shop'

@getContext({
  server: PropTypes.func,
  serverError: PropTypes.func,
  user: PropTypes.object,
  setPanel: PropTypes.func,
})
export default class ShopsPanel extends Component {

  constructor(props){
    super(props)

    this.state = { edit: false }

    this.editShop = this.editShop.bind(this)
  }

  componentDidMount() {
    const { server, serverError } = this.props

    // server.get(`/shops`)
    //   .then(({data}) => this.setState({ shops: data }))
    //   .catch(e => {
    //     serverError(e)
    //   })

  }

  editShop(shop) {
    this.setState({ edit: shop || false })
  }

  render() {

    const { setPanel } = this.props
    const { edit } = this.state

    return (<div className="">

      { !edit && <Shops editShop={this.editShop} />}
      { edit && <Shop shop={edit} editShop={this.editShop} />}

      <style jsx>{`
          
      `}</style>  

    </div>)

  }

}
