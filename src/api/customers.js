// api/customers.js: network code, no React
export async function listCustomers() {
  const r = await fetch('/api/customers')
  if (!r.ok) throw new Error(`Load failed: ${r.status}`)
  return r.json()
}

export async function createCustomer(data) {
  const r = await fetch('/api/customers', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!r.ok) throw new Error(`Save failed: ${r.status}`)
  return r.json()
}