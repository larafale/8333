import Head from 'next/head'
import Router from 'next/router'
import NProgress from 'nprogress'

import Header from './Header'
import Footer from './Footer'


Router.onRouteChangeStart = (url) => NProgress.start()
Router.onRouteChangeComplete = () => NProgress.done()
Router.onRouteChangeError = () => NProgress.done()


export default  function Layout({ children }) { return (
  <div className="html">

    <Head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>8333.io</title>

      <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta.3/css/bootstrap.min.css" integrity="sha384-Zug+QiDoJOrZ5t4lssLdxGhVrurbmBWopoEl+M6BdEfwnCJZtKxi1KgxUyJq13dy" crossorigin="anonymous"/>
      <link rel='stylesheet' type='text/css' href='/static/css/app.css' />
      <link rel='stylesheet' type='text/css' href='/static/css/utils.css' />
      <link rel='stylesheet' type='text/css' href='/static/css/nprogress.css' />
      <link rel='stylesheet' type='text/css' href='/static/css/animate.css' />
      <link rel='stylesheet' type='text/css' href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css' />
      <link href="https://fonts.googleapis.com/css?family=Anonymous+Pro" rel="stylesheet"/>
      <script src="https://code.jquery.com/jquery-3.2.1.min.js"></script>
      <script src="https://npmcdn.com/tether@1.2.4/dist/js/tether.min.js"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js"></script>
      <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta.3/js/bootstrap.min.js"></script>
    </Head>



    <div className="body">
      <Header />
      <div className="body-content">
      {children}
      </div>
      <Footer />
    </div>

    <style jsx>{`
      .body {
        display: flex;
        min-height: 100vh;
        flex-direction: column;
      }
      .body-content {
        flex: 1;
      }
      `}</style>
    
  </div>
)}