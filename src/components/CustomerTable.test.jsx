import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup, within } from '@testing-library/react'
import CustomerTable from './CustomerTable'

afterEach(cleanup) // without this, each render piles up on the page

const data = [
  { id: 1, name: 'Ada Lovelace', email: 'ada@example.com', createdAt: '2024-03-10T12:00:00Z' },
  { id: 2, name: 'Grace Hopper', email: 'grace@example.com', createdAt: '2026-11-19T18:00:00Z' },
]

const bodyNames = () =>
  screen.getAllByRole('row').slice(1).map(r => within(r).getAllByRole('cell')[1].textContent)

describe('CustomerTable', () => {
  it('shows the empty message', () => {
    render(<CustomerTable customers={[]} />)
    expect(screen.getByText('No customers yet.')).toBeTruthy()
  })

  it('filters by name or email, case-insensitively', () => {
    render(<CustomerTable customers={data} />)
    fireEvent.change(screen.getByPlaceholderText(/search/i), { target: { value: 'ADA' } })
    expect(bodyNames()).toEqual(['Ada Lovelace'])
  })

  it('filters by the date text', () => {
    render(<CustomerTable customers={data} />)
    fireEvent.change(screen.getByPlaceholderText(/search/i), { target: { value: '2024' } })
    expect(bodyNames()).toEqual(['Ada Lovelace'])
  })

  it('shows "No matches." when nothing matches', () => {
    render(<CustomerTable customers={data} />)
    fireEvent.change(screen.getByPlaceholderText(/search/i), { target: { value: 'zzz' } })
    expect(screen.getByText('No matches.')).toBeTruthy()
  })

  it('sorts by a header and toggles direction', () => {
    render(<CustomerTable customers={data} />)
    fireEvent.click(screen.getByText(/^Name/))
    expect(bodyNames()).toEqual(['Ada Lovelace', 'Grace Hopper'])
    fireEvent.click(screen.getByText(/^Name/))
    expect(bodyNames()).toEqual(['Grace Hopper', 'Ada Lovelace'])
  })

  it('does not mutate the prop array', () => {
    const copy = [...data]
    render(<CustomerTable customers={copy} />)
    fireEvent.click(screen.getByText(/^Name/))
    fireEvent.click(screen.getByText(/^Name/))
    expect(copy).toEqual(data)
  })
})
