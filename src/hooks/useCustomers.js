// hooks/useCustomers.js: state + effects, no markup
import { useCallback, useEffect, useState } from 'react'
import { listCustomers } from '../api/customers'

export function useCustomers() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const reload = useCallback(async () => {
    try {
      setCustomers(await listCustomers())
      setError('')
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { reload() }, [reload])

  return { customers, loading, error, reload }
}