import React, { Component } from 'react'


export default class Steper extends Component {

  constructor(props){
    super(props)

    const { step, steps } = props

    this.state = { 
        step: step || 0
      , steps: steps || [1, 2, 3]
    }
  }

  render() {

    const { title, onStep } = this.props
    const { step, steps } = this.state
    const ratio = 100 / (steps.length - 1)
    const width = step * ratio

    const setStep = (step, i) => {
      this.setState({ step: i })
      onStep && onStep(step)
    }

    return (<div>

      <div className="steper">
        <div className="dots d-flex justify-content-between">
          { steps.map((step, i) => (<div onClick={()=>setStep(step, i)} key={i}>
            <div className="backdot"> </div>
            <div className="dot"> </div>
            <div className="dot-title">{(title && title(step, i)) || step}</div>
          </div>))}
        </div>
        <div className="backbar"></div>
        <div className="bar" style={{width: `${width}%`}}></div>
      </div>


      <style jsx>{`
        .steper {
          position: relative;
          z-index: 2;
        }

        .dots > div {
          cursor: pointer;
        }

        .backdot {
          position: absolute;
          z-index: -1;
          top: -5px;
          margin-left: -5px;
          height: 23px;
          width: 23px;
          background: #52585f;
          border-radius: 50%;
        }
        .dot {
          background: #ffc107;
          width: 13px;
          height: 13px;
          border-radius: 50%;
          box-shadow: 0px 0px 3px #000;
        }
        .dot:hover {
          background: #fff;
        }
        .dot-title {
          position: absolute;
          top: -35px;
          color: #fff;
          margin-left: -45px;
          width: 100px;
          font-size: 14px;
        }

        .backbar {
          z-index: -2;
          position: absolute;
          top: 2px;
          height: 10px;
          width: 100%;
          background: #52585f;
        }
        .bar {
          z-index: -1;
          position: absolute;
          top: 6px;
          height: 2px;
          background: #ffc107;
          -webkit-transition: width 1s ease;
            -moz-transition: width 1s ease;
              -o-transition: width 1s ease;
                 transition: width 1s ease;
        }


      `}</style>

    </div>)
  }
}
