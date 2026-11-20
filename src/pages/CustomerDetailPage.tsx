import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useCustomer } from '../hooks/useCustomer'
import { updateCustomer } from '../api/customers'
import { errorMessage } from '../errors'
import type { CustomerInput } from '../types'
import CustomerForm from '../components/CustomerForm'

export default function CustomerDetailPage() {
  const { id } = useParams()          // type: string | undefined (the URL might not have an id)
  if (!id) return <p>Customer not found.</p>
  return <CustomerDetail id={id} />   // from here on, TypeScript knows id is a string
}

function CustomerDetail({ id }: { id: string }) {
  const { state, setCustomer } = useCustomer(id)
  const [editing, setEditing] = useState(false)
  const [saveError, setSaveError] = useState('')

  async function save(data: CustomerInput) {
    try {
      setCustomer(await updateCustomer(id, data))   // show what the API saved
      setSaveError('')
      setEditing(false)
    } catch (e) {
      setSaveError(errorMessage(e))                 // stay in edit mode, keep the typing
      throw e
    }
  }

  return (
    <>
      <p><Link to="/">← Back to customers</Link></p>
      {state.status === 'loading' && <p>Loading…</p>}
      {state.status === 'notfound' && <p>Customer not found.</p>}
      {state.status === 'error' && <p role="alert">{state.error}</p>}
      {state.status === 'ready' && (editing ? (
        <>
          {saveError && <p role="alert">{saveError}</p>}
          <CustomerForm
            initial={state.customer}
            submitLabel="Save"
            clearOnSubmit={false}
            onSubmit={save}
            onCancel={() => { setEditing(false); setSaveError('') }}
          />
        </>
      ) : (
        <>
          <dl>
            <dt>ID</dt><dd>{state.customer.id}</dd>
            <dt>Name</dt><dd>{state.customer.name}</dd>
            <dt>Email</dt><dd>{state.customer.email}</dd>
            <dt>Created</dt><dd>{state.customer.createdAt ? new Date(state.customer.createdAt).toLocaleString() : ''}</dd>
          </dl>
          <button onClick={() => setEditing(true)}>Edit</button>
        </>
      ))}
    </>
  )
}
