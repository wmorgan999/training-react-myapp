import { describe, it, expect, afterEach, vi } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import CustomerDetailPage from './CustomerDetailPage'

afterEach(() => { cleanup(); vi.unstubAllGlobals() })

// Render the page at a URL, with fetch replaced by a fake response
function renderAt(url: string, response: object) {
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

  // Edit flow: first fetch loads the customer, second is the PUT
  const ada = { id: 1, name: 'Ada Lovelace', email: 'ada@example.com', createdAt: null }
  const ok = (body: object) => ({ ok: true, status: 200, json: async () => body })

  function renderEditable(putResponse: object) {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(ok(ada))
      .mockResolvedValueOnce(putResponse)
    vi.stubGlobal('fetch', fetchMock)
    render(
      <MemoryRouter initialEntries={['/customers/1']}>
        <Routes><Route path="/customers/:id" element={<CustomerDetailPage />} /></Routes>
      </MemoryRouter>
    )
    return fetchMock
  }

  it('edits and saves a customer with PUT', async () => {
    const fetchMock = renderEditable(ok({ ...ada, name: 'Ada King' }))
    await userEvent.click(await screen.findByRole('button', { name: 'Edit' }))

    const name = screen.getByPlaceholderText('Name')
    await userEvent.clear(name)
    await userEvent.type(name, 'Ada King')
    await userEvent.click(screen.getByRole('button', { name: 'Save' }))

    expect(await screen.findByText('Ada King')).toBeTruthy()      // back to read-only view
    const [url, init] = fetchMock.mock.calls[1] ?? []
    expect(url).toBe('/api/customers/1')
    expect(init?.method).toBe('PUT')
    expect(JSON.parse(init?.body)).toEqual({ name: 'Ada King', email: 'ada@example.com' })
  })

  it('shows the 409 message and stays in the form', async () => {
    renderEditable({ ok: false, status: 409 })
    await userEvent.click(await screen.findByRole('button', { name: 'Edit' }))
    await userEvent.click(screen.getByRole('button', { name: 'Save' }))

    expect((await screen.findByRole('alert')).textContent).toBe('That email is already registered.')
    expect(screen.getByPlaceholderText('Name')).toBeTruthy()      // still editing
  })

  it('Cancel leaves edit mode without saving', async () => {
    const fetchMock = renderEditable(ok(ada))
    await userEvent.click(await screen.findByRole('button', { name: 'Edit' }))
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(screen.getByRole('button', { name: 'Edit' })).toBeTruthy()
    expect(fetchMock).toHaveBeenCalledTimes(1)                    // only the initial GET
  })
})
