import { Link, useParams } from 'react-router-dom'
import { useCustomer } from '../hooks/useCustomer'

export default function CustomerDetailPage() {
  const { id } = useParams()                 // always a string, e.g. "7"
  const { status, customer, error } = useCustomer(id)

  return (
    <>
      <p><Link to="/">← Back to customers</Link></p>
      {status === 'loading' && <p>Loading…</p>}
      {status === 'notfound' && <p>Customer not found.</p>}
      {status === 'error' && <p role="alert">{error}</p>}
      {status === 'ready' && (
        <dl>
          <dt>ID</dt><dd>{customer.id}</dd>
          <dt>Name</dt><dd>{customer.name}</dd>
          <dt>Email</dt><dd>{customer.email}</dd>
          <dt>Created</dt><dd>{customer.createdAt ? new Date(customer.createdAt).toLocaleString() : ''}</dd>
        </dl>
      )}
    </>
  )
}
