import { describe, it, expect, afterEach, vi } from 'vitest'
import { createCustomer, updateCustomer, deleteCustomer } from './customers'

afterEach(() => vi.unstubAllGlobals())
const respond = (status, body) =>
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: status < 400, status, json: async () => body }))

describe('customers api', () => {
  it('maps 409 to a readable duplicate-email message', async () => {
    respond(409)
    await expect(createCustomer({})).rejects.toThrow('That email is already registered.')
    await expect(updateCustomer(1, {})).rejects.toThrow('That email is already registered.')
  })

  it('keeps the status in other save errors', async () => {
    respond(500)
    await expect(createCustomer({})).rejects.toThrow('Save failed: 500')
  })

  it('update reports a missing customer', async () => {
    respond(404)
    await expect(updateCustomer(9, {})).rejects.toThrow('Customer not found.')
  })

  it('delete treats 204 and 404 as success, other errors throw', async () => {
    respond(204)
    await expect(deleteCustomer(1)).resolves.toBeUndefined()
    expect(fetch).toHaveBeenCalledWith('/api/customers/1', { method: 'DELETE' })
    respond(404)
    await expect(deleteCustomer(1)).resolves.toBeUndefined()
    respond(500)
    await expect(deleteCustomer(1)).rejects.toThrow('Delete failed: 500')
  })
})
