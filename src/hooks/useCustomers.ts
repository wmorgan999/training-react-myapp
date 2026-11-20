// hooks/useCustomers.ts: state + effects, no markup
import { useCallback, useEffect, useState } from 'react'
import { listCustomers } from '../api/customers'
import { errorMessage } from '../errors'
import type { Customer } from '../types'

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([])   // <Customer[]>: what the state holds
  const [loading, setLoading] = useState(true)                 // inferred: boolean
  const [error, setError] = useState('')                       // inferred: string

  const reload = useCallback(async () => {
    try {
      setCustomers(await listCustomers())
      setError('')
    } catch (e) {
      setError(errorMessage(e))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { reload() }, [reload])

  return { customers, loading, error, reload }
}
