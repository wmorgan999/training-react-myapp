import { useCustomers } from '../hooks/useCustomers'
import { createCustomer } from '../api/customers'
import CustomerForm from '../components/CustomerForm'
import CustomerTable from '../components/CustomerTable'

export default function CustomersPage() {
  const { customers, loading, error, reload } = useCustomers()

  const add = async data => {
    await createCustomer(data)
    await reload()
  }

  if (loading) return <p>Loading…</p>
  return (
    <>
      {error && <p role="alert">{error}</p>}
      <CustomerForm onSubmit={add} />
      <CustomerTable customers={customers} />
    </>
  )
}