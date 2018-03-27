import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import _ from 'lodash'
import { getContext } from 'recompose'

import Wallets from './Wallets'
import Wallet from './Wallet'

@getContext({
  server: PropTypes.func,
  serverError: PropTypes.func,
  user: PropTypes.object,
  setPanel: PropTypes.func,
})
export default class WalletsPanel extends Component {

  constructor(props){
    super(props)

    this.state = { edit: false }

    this.editWallet = this.editWallet.bind(this)
  }

  componentDidMount() {
    const { server, serverError } = this.props

    // server.get(`/wallets`)
    //   .then(({data}) => this.setState({ wallets: data }))
    //   .catch(e => {
    //     serverError(e)
    //   })

  }

  editWallet(wallet) {
    this.setState({ edit: wallet || false })
  }

  render() {

    const { setPanel } = this.props
    const { edit } = this.state

    return (<div className="">

      { !edit && <Wallets editWallet={this.editWallet} />}
      { edit && <Wallet wallet={edit} editWallet={this.editWallet} />}


    </div>)

  }

}
