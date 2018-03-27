import React, { Component } from 'react'
import Script from 'react-load-script'


class RedocBox extends Component {

  render() {
    return <div style={{background: 'whitesmoke'}}>
      <redoc />
      <Script
        url="https://rebilly.github.io/ReDoc/releases/latest/redoc.min.js"
        onCreate={()=>{}}
        onError={()=>{}}
        onLoad={()=>Redoc.init('/static/docs.yaml')}
      />
    </div>
  }
}

export default () => (<div>

  <RedocBox />

</div>)