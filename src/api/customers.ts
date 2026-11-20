// api/customers.ts: network code, no React
import type { Customer, CustomerInput } from '../types'

const EMAIL_TAKEN = 'That email is already registered.'

// One place that turns a failed response into an Error with a message people can read.
// `never` = this function always throws and never returns.
function fail(r: Response, what: string): never {
  if (r.status === 409) throw new Error(EMAIL_TAKEN)   // the API's "duplicate email" answer
  throw new Error(`${what} failed: ${r.status}`)
}

const jsonInit = (method: string, data: CustomerInput): RequestInit => ({
  method,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data),
})

export async function listCustomers(): Promise<Customer[]> {
  const r = await fetch('/api/customers')
  if (!r.ok) throw new Error(`Load failed: ${r.status}`)
  return r.json()            // json() is typed `any`: TypeScript trusts that the server sent a Customer[]
}

// Returns the customer, or null when the API says 404 (so "not found" is
// an expected outcome, not an error). Other failures still throw.
export async function getCustomer(id: string | number): Promise<Customer | null> {
  const r = await fetch(`/api/customers/${encodeURIComponent(id)}`)
  if (r.status === 404) return null
  if (!r.ok) throw new Error(`Load failed: ${r.status}`)
  return r.json()
}

export async function createCustomer(data: CustomerInput): Promise<Customer> {
  const r = await fetch('/api/customers', jsonInit('POST', data))
  if (!r.ok) fail(r, 'Save')
  return r.json()
}

export async function updateCustomer(id: string | number, data: CustomerInput): Promise<Customer> {
  const r = await fetch(`/api/customers/${encodeURIComponent(id)}`, jsonInit('PUT', data))
  if (r.status === 404) throw new Error('Customer not found.')
  if (!r.ok) fail(r, 'Save')
  return r.json()
}

// 204 means deleted. 404 means it was already gone, which is the outcome we wanted anyway.
export async function deleteCustomer(id: string | number): Promise<void> {
  const r = await fetch(`/api/customers/${encodeURIComponent(id)}`, { method: 'DELETE' })
  if (!r.ok && r.status !== 404) throw new Error(`Delete failed: ${r.status}`)
}
