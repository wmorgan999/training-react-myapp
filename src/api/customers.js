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

// Returns the customer, or null when the API says 404 (so "not found" is
// an expected outcome, not an error). Other failures still throw.
export async function getCustomer(id) {
  const r = await fetch(`/api/customers/${encodeURIComponent(id)}`)
  if (r.status === 404) return null
  if (!r.ok) throw new Error(`Load failed: ${r.status}`)
  return r.json()
}
