// hooks/useCustomer.js: load ONE customer; re-runs when `id` changes
import { useCallback, useEffect, useState } from 'react'
import { getCustomer } from '../api/customers'

export function useCustomer(id) {
  // status: 'loading' | 'ready' | 'notfound' | 'error'
  const [state, setState] = useState({ status: 'loading', customer: null, error: '' })

  useEffect(() => {
    let ignore = false            // stops a slow, old response overwriting a newer one
    setState({ status: 'loading', customer: null, error: '' })
    getCustomer(id)
      .then(c => { if (!ignore) setState(c
        ? { status: 'ready', customer: c, error: '' }
        : { status: 'notfound', customer: null, error: '' }) })
      .catch(e => { if (!ignore) setState({ status: 'error', customer: null, error: e.message }) })
    return () => { ignore = true }   // cleanup runs before the next effect and on unmount
  }, [id])

  // After a successful edit, the API returns the saved customer: show it without re-fetching.
  const setCustomer = useCallback(
    customer => setState({ status: 'ready', customer, error: '' }), [])

  return { ...state, setCustomer }
}
