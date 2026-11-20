// components/CustomerTable.jsx: search + sortable headers.
// Filter text and sort choice are state; the visible rows are DERIVED each render.
import { useState } from 'react'
import { Link } from 'react-router-dom'

// One place that turns a customer's date into the text the user sees.
// Search matches this same text, so "what you see is what you can search".
const fmtDate = v => (v ? new Date(v).toLocaleString() : '')

const COLUMNS = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'createdAt', label: 'Created' },
]

export default function CustomerTable({ customers, onDelete }) {
  const [query, setQuery] = useState('')
  const [confirmId, setConfirmId] = useState(null)   // which row is showing "Delete? Yes / No"
  const [sortKey, setSortKey] = useState('id')
  const [sortDir, setSortDir] = useState('asc')

  // Hooks must run before any early return.
  if (!customers.length) return <p>No customers yet.</p>

  const q = query.trim().toLowerCase()
  const visible = customers
    .filter(c =>
      !q ||
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      fmtDate(c.createdAt).toLowerCase().includes(q) ||  // what's shown...
      (c.createdAt ?? '').toLowerCase().includes(q)      // ...and the raw ISO text, so "2026-11" works
    )
    .sort((a, b) => {
      const x = a[sortKey] ?? '', y = b[sortKey] ?? ''
      const cmp = typeof x === 'number' && typeof y === 'number'
        ? x - y
        : String(x).localeCompare(String(y))   // ISO dates sort correctly as text
      return sortDir === 'asc' ? cmp : -cmp
    })

  function toggleSort(key) {
    if (key === sortKey) setSortDir(d => (d === 'asc' ? 'desc' : 'asc'))
    else { setSortKey(key); setSortDir('asc') }
  }

  return (
    <>
      <input
        placeholder="Search name, email or date"
        value={query}
        onChange={e => setQuery(e.target.value)}
      />
      {visible.length === 0 ? (
        <p>No matches.</p>
      ) : (
        <table border="1" cellPadding="6" style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              {COLUMNS.map(col => (
                <th key={col.key} onClick={() => toggleSort(col.key)} style={{ cursor: 'pointer' }}>
                  {col.label}{sortKey === col.key ? (sortDir === 'asc' ? ' ▲' : ' ▼') : ''}
                </th>
              ))}
              {onDelete && <th></th>}
            </tr>
          </thead>
          <tbody>
            {visible.map(c => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td><Link to={`/customers/${c.id}`}>{c.name}</Link></td>
                <td>{c.email}</td>
                <td>{fmtDate(c.createdAt)}</td>
                {onDelete && (
                  <td>
                    {confirmId === c.id ? (
                      <>
                        Delete?{' '}
                        <button onClick={async () => { await onDelete(c.id); setConfirmId(null) }}>Yes</button>{' '}
                        <button onClick={() => setConfirmId(null)}>No</button>
                      </>
                    ) : (
                      <button onClick={() => setConfirmId(c.id)}>Delete</button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  )
}
