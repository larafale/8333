require('dotenv').config()
const micro =  require('micro')
const { send } =  require('micro')
const { router, get, redirect } =  require('./lib/router')
const next =  require('next')
require('isomorphic-fetch')


const app = next({ dev: process.env.NODE_ENV == 'local' })
const handle = app.getRequestHandler()

const rule = (url, query) => get(url, (req, res) => {
  const q = typeof query == 'function' ? query(req) : query || {}
  return app.render(req, res, '/app', { ...req.params, ...req.query, ...q })
})


app.prepare().then(() => {

  const microHandler = router(

    get('/favicon.ico', (req, res) => app.serveStatic(req, res, `./static/favicon.ico`)),
    get('/robots.txt', (req, res) => app.serveStatic(req, res, `./static/robots.txt`)),

    get('/', (req, res) => redirect('http://ready.very.soon')(req, res)),
    rule('/home', { page: 'site' }),
    rule('/docs', { page: 'docs' }),
    rule('/explorer', { page: 'explorer' }),
    rule('/login/*', req => ({ page: 'app', jwt: req.params._ })),
    rule('/app', { page: 'app' }),
    rule('/app/:panel', { page: 'app' }),
    rule('/invoice/:id', { page: 'invoice' }),
    rule('/widget/:id', { page: 'widget' }),
    
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

