const { parse } = require('url')
const UrlPattern = require('url-pattern')
const { send } =  require('micro')

const getParamsAndQuery = (pattern, url) => {
  const { query, pathname } = parse(url, true)
  const route = pattern instanceof UrlPattern ? pattern : new UrlPattern(pattern)
  const params = route.match(pathname)

  return { query, params }
}

const METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS']

const methodFn = method => (path, handler) => {
  if (!path) throw new Error('You need to set a valid path')
  if (!handler) throw new Error('You need to set a valid handler')

  const route = new UrlPattern(path)

  return (req, res) => {
    const { params, query } = getParamsAndQuery(route, req.url)

    if (params && req.method === method) {
      return handler(Object.assign(req, { params, query }), res)
    }
  }
}

exports.router = (...funcs) => async (req, res) => {
  for (const fn of funcs) {
    const result = await fn(req, res)
    if (result || res.headersSent) return result
  }
}

exports.redirect = url => (req, res) => {
  res.statusCode = 302
  res.setHeader('Location', `${url}${req.url}`)
  send(res, 302)
}

METHODS.forEach(method => {
  exports[method === 'DELETE' ? 'del' : method.toLowerCase()] = methodFn(method)
})
