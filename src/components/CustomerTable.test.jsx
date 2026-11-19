import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import CustomerTable from './CustomerTable'

afterEach(cleanup) // without this, each render piles up on the page

const data = [
  { id: 1, name: 'Ada Lovelace', email: 'ada@example.com', createdAt: '2024-03-10T12:00:00Z' },
  { id: 2, name: 'Grace Hopper', email: 'grace@example.com', createdAt: '2026-11-19T18:00:00Z' },
]

// <Link> needs a router around it; MemoryRouter is a fake one for tests
const renderTable = rows =>
  render(<MemoryRouter><CustomerTable customers={rows} /></MemoryRouter>)

const bodyNames = () =>
  screen.getAllByRole('row').slice(1).map(r => within(r).getAllByRole('cell')[1].textContent)

describe('CustomerTable', () => {
  it('shows the empty message', () => {
    renderTable([])
    expect(screen.getByText('No customers yet.')).toBeTruthy()
  })

  it('filters by name or email, case-insensitively', () => {
    renderTable(data)
    fireEvent.change(screen.getByPlaceholderText(/search/i), { target: { value: 'ADA' } })
    expect(bodyNames()).toEqual(['Ada Lovelace'])
  })

  it('filters by the date text', () => {
    renderTable(data)
    fireEvent.change(screen.getByPlaceholderText(/search/i), { target: { value: '2024' } })
    expect(bodyNames()).toEqual(['Ada Lovelace'])
  })

  it('shows "No matches." when nothing matches', () => {
    renderTable(data)
    fireEvent.change(screen.getByPlaceholderText(/search/i), { target: { value: 'zzz' } })
    expect(screen.getByText('No matches.')).toBeTruthy()
  })

  it('sorts by a header and toggles direction', () => {
    renderTable(data)
    fireEvent.click(screen.getByText(/^Name/))
    expect(bodyNames()).toEqual(['Ada Lovelace', 'Grace Hopper'])
    fireEvent.click(screen.getByText(/^Name/))
    expect(bodyNames()).toEqual(['Grace Hopper', 'Ada Lovelace'])
  })

  it('links each name to its detail page', () => {
    renderTable(data)
    expect(screen.getByRole('link', { name: 'Grace Hopper' }).getAttribute('href')).toBe('/customers/2')
  })

  it('does not mutate the prop array', () => {
    const copy = [...data]
    renderTable(copy)
    fireEvent.click(screen.getByText(/^Name/))
    fireEvent.click(screen.getByText(/^Name/))
    expect(copy).toEqual(data)
  })
})
