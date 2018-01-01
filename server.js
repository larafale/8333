require('dotenv').config()
const micro =  require('micro')
const { send } =  require('micro')
const { router, get, redirect } =  require('./lib/router')
const next =  require('next')
require('isomorphic-fetch')


const app = next({ dev: process.env.NODE_ENV === 'local' })
const handle = app.getRequestHandler()


app.prepare().then(() => {

  const microHandler = router(

    // get('/api/*', redirect('https://partners.inmemori.com')),
    // get('/favicon.ico', (req, res) => app.serveStatic(req, res, `./static/favicon.ico`)),
    get('/robots.txt', (req, res) => app.serveStatic(req, res, `./static/robots.txt`)),

    get('/', (req, res) => app.render(req, res, '/app', { page: 'site' })),
    get('/explorer', (req, res) => app.render(req, res, '/app', { page: 'explorer' })),
    get('/app', (req, res) => app.render(req, res, '/app', { page: 'app' })),


    
    get('/*', (req, res) => handle(req, res))
  )

  const server = micro(microHandler)

  server.listen(process.env.PORT, (err) => {
    if (err) throw err
    console.log(`> app [${process.env.NODE_ENV}] port:${process.env.PORT}`)
  })
})
.catch((ex) => {
  console.error(ex.stack)
  process.exit(1)
})

