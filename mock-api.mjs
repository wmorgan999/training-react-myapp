// A tiny stand-in for the homelab API. Same URLs and JSON shapes, data kept in memory.
// Run:  node mock-api.mjs      (stop with Ctrl+C; data resets on restart)
import http from 'node:http'

const customers = [
  { id: 1, name: 'Ada Lovelace', email: 'ada@example.com', createdAt: new Date().toISOString() },
  { id: 2, name: 'Grace Hopper', email: 'grace@example.com', createdAt: new Date().toISOString() },
]
let nextId = 3

const send = (res, status, body) => {
  res.writeHead(status, { 'Content-Type': 'application/json' })
  res.end(body === undefined ? '' : JSON.stringify(body))
}

http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost')
  const one = url.pathname.match(/^\/api\/customers\/(\d+)$/)

  if (req.method === 'GET' && url.pathname === '/api/customers') return send(res, 200, customers)

  if (req.method === 'GET' && one) {
    const c = customers.find(x => x.id === Number(one[1]))
    return c ? send(res, 200, c) : send(res, 404)
  }

  // Read a JSON request body, then call fn(data). Same shapes as the real API.
  const withBody = fn => {
    let raw = ''
    req.on('data', chunk => (raw += chunk))
    req.on('end', () => {
      let data
      try { data = JSON.parse(raw) } catch { return send(res, 400, { error: 'bad json' }) }
      fn(data)
    })
  }
  const emailTaken = (email, exceptId) => customers.some(c => c.email === email && c.id !== exceptId)
  const TAKEN = { error: 'That email is already registered.' }

  if (req.method === 'POST' && url.pathname === '/api/customers') {
    return withBody(data => {
      // The real API answers 409 Conflict when the email already exists
      if (emailTaken(data.email)) return send(res, 409, TAKEN)
      const saved = { id: nextId++, name: data.name, email: data.email, createdAt: new Date().toISOString() }
      customers.push(saved)
      // The real API's POST response has createdAt null (the database fills it in); the next GET has it
      send(res, 200, { ...saved, createdAt: null })
    })
  }

  if (req.method === 'PUT' && one) {
    const c = customers.find(x => x.id === Number(one[1]))
    if (!c) return send(res, 404)
    return withBody(data => {
      if (emailTaken(data.email, c.id)) return send(res, 409, TAKEN)
      c.name = data.name
      c.email = data.email
      send(res, 200, c)            // the real PUT returns the saved customer, createdAt included
    })
  }

  if (req.method === 'DELETE' && one) {
    const i = customers.findIndex(x => x.id === Number(one[1]))
    if (i < 0) return send(res, 404)
    customers.splice(i, 1)
    return send(res, 204)
  }

  send(res, 404, { error: 'not found' })
}).listen(8080, () => console.log('Mock API on http://localhost:8080'))
