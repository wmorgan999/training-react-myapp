import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useCustomer } from '../hooks/useCustomer'
import { updateCustomer } from '../api/customers'
import CustomerForm from '../components/CustomerForm'

export default function CustomerDetailPage() {
  const { id } = useParams()                 // always a string, e.g. "7"
  const { status, customer, error, setCustomer } = useCustomer(id)
  const [editing, setEditing] = useState(false)
  const [saveError, setSaveError] = useState('')

  async function save(data) {
    try {
      setCustomer(await updateCustomer(id, data))   // show what the API saved
      setSaveError('')
      setEditing(false)
    } catch (e) {
      setSaveError(e.message)                       // stay in edit mode, keep the typing
      throw e
    }
  }

  return (
    <>
      <p><Link to="/">← Back to customers</Link></p>
      {status === 'loading' && <p>Loading…</p>}
      {status === 'notfound' && <p>Customer not found.</p>}
      {status === 'error' && <p role="alert">{error}</p>}
      {status === 'ready' && (editing ? (
        <>
          {saveError && <p role="alert">{saveError}</p>}
          <CustomerForm
            initial={customer}
            submitLabel="Save"
            clearOnSubmit={false}
            onSubmit={save}
            onCancel={() => { setEditing(false); setSaveError('') }}
          />
        </>
      ) : (
        <>
          <dl>
            <dt>ID</dt><dd>{customer.id}</dd>
            <dt>Name</dt><dd>{customer.name}</dd>
            <dt>Email</dt><dd>{customer.email}</dd>
            <dt>Created</dt><dd>{customer.createdAt ? new Date(customer.createdAt).toLocaleString() : ''}</dd>
          </dl>
          <button onClick={() => setEditing(true)}>Edit</button>
        </>
      ))}
    </>
  )
}
