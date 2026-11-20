// hooks/useCustomer.ts: load ONE customer; re-runs when `id` changes
import { useCallback, useEffect, useState } from 'react'
import { getCustomer } from '../api/customers'
import { errorMessage } from '../errors'
import type { Customer } from '../types'

// A "discriminated union": `status` says which shape you have, so TypeScript knows
// `customer` exists only when status is 'ready' and `error` only when it is 'error'.
export type CustomerState =
  | { status: 'loading' }
  | { status: 'ready'; customer: Customer }
  | { status: 'notfound' }
  | { status: 'error'; error: string }

export function useCustomer(id: string) {
  const [state, setState] = useState<CustomerState>({ status: 'loading' })

  useEffect(() => {
    let ignore = false            // stops a slow, old response overwriting a newer one
    setState({ status: 'loading' })
    getCustomer(id)
      .then(c => { if (!ignore) setState(c ? { status: 'ready', customer: c } : { status: 'notfound' }) })
      .catch(e => { if (!ignore) setState({ status: 'error', error: errorMessage(e) }) })
    return () => { ignore = true }   // cleanup runs before the next effect and on unmount
  }, [id])

  // After a successful edit, the API returns the saved customer: show it without re-fetching.
  const setCustomer = useCallback(
    (customer: Customer) => setState({ status: 'ready', customer }), [])

  return { state, setCustomer }
}
