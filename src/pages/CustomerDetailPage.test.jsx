import { describe, it, expect, afterEach, vi } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import CustomerDetailPage from './CustomerDetailPage'

afterEach(() => { cleanup(); vi.unstubAllGlobals() })

// Render the page at a URL, with fetch replaced by a fake response
function renderAt(url, response) {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response))
  render(
    <MemoryRouter initialEntries={[url]}>
      <Routes><Route path="/customers/:id" element={<CustomerDetailPage />} /></Routes>
    </MemoryRouter>
  )
}

describe('CustomerDetailPage', () => {
  it('shows the customer', async () => {
    renderAt('/customers/1', { ok: true, status: 200,
      json: async () => ({ id: 1, name: 'Ada Lovelace', email: 'ada@example.com', createdAt: null }) })
    expect(await screen.findByText('Ada Lovelace')).toBeTruthy()
    expect(fetch).toHaveBeenCalledWith('/api/customers/1')
  })

  it('shows "Customer not found." on 404', async () => {
    renderAt('/customers/999', { ok: false, status: 404 })
    expect(await screen.findByText('Customer not found.')).toBeTruthy()
  })

  it('shows an error for other failures', async () => {
    renderAt('/customers/1', { ok: false, status: 500 })
    expect((await screen.findByRole('alert')).textContent).toBe('Load failed: 500')
  })
})
