import { useState } from 'react'
import { useCustomers } from '../hooks/useCustomers'
import { createCustomer, deleteCustomer } from '../api/customers'
import CustomerForm from '../components/CustomerForm'
import CustomerTable from '../components/CustomerTable'

export default function CustomersPage() {
  const { customers, loading, error, reload } = useCustomers()
  const [actionError, setActionError] = useState('')   // failed add/delete, shown to the person

  // Run an action, show its error, and re-throw so the caller knows it failed.
  const run = async fn => {
    try {
      await fn()
      setActionError('')
      await reload()
    } catch (e) {
      setActionError(e.message)
      throw e
    }
  }

  const add = data => run(() => createCustomer(data))
  const remove = id => run(() => deleteCustomer(id)).catch(() => {})   // error already shown

  if (loading) return <p>Loading…</p>
  return (
    <>
      {error && <p role="alert">{error}</p>}
      {actionError && <p role="alert">{actionError}</p>}
      <CustomerForm onSubmit={add} />
      <CustomerTable customers={customers} onDelete={remove} />
    </>
  )
}
