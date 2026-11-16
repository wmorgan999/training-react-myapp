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

  if (req.method === 'POST' && url.pathname === '/api/customers') {
    let raw = ''
    req.on('data', chunk => (raw += chunk))
    req.on('end', () => {
      let data
      try { data = JSON.parse(raw) } catch { return send(res, 400, { error: 'bad json' }) }
      // The real API's database rejects a duplicate email, which surfaces as a 500
      if (customers.some(c => c.email === data.email)) return send(res, 500, { error: 'duplicate email' })
      const saved = { id: nextId++, name: data.name, email: data.email, createdAt: new Date().toISOString() }
      customers.push(saved)
      // The real API's POST response has createdAt null (the database fills it in); the next GET has it
      send(res, 200, { ...saved, createdAt: null })
    })
    return
  }

  send(res, 404, { error: 'not found' })
}).listen(8080, () => console.log('Mock API on http://localhost:8080'))
