// components/CustomerTable.jsx: markup only (the same table the homelab renders inline)
export default function CustomerTable({ customers }) {
  if (!customers.length) return <p>No customers yet.</p>
  return (
    <table border="1" cellPadding="6" style={{ borderCollapse: 'collapse', width: '100%' }}>
      <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Created</th></tr></thead>
      <tbody>
        {customers.map(c => (
          <tr key={c.id}>
            <td>{c.id}</td><td>{c.name}</td><td>{c.email}</td>
            <td>{c.createdAt ? new Date(c.createdAt).toLocaleString() : ''}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}