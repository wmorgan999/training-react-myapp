// components/CustomerForm.tsx: owns its own input state.
// Used for both "add" (empty) and "edit" (pass initial values, a label and onCancel).
import { useState } from 'react'
import type { FormEvent } from 'react'
import type { CustomerInput } from '../types'

// The props are a contract: the parent must pass onSubmit, everything with `?` is optional.
interface Props {
  onSubmit: (data: CustomerInput) => Promise<unknown> | void
  initial?: CustomerInput
  submitLabel?: string
  clearOnSubmit?: boolean
  onCancel?: () => void
}

export default function CustomerForm({
  onSubmit,
  initial = { name: '', email: '' },
  submitLabel = 'Add',
  clearOnSubmit = true,
  onCancel,
}: Props) {
  const [name, setName] = useState(initial.name)
  const [email, setEmail] = useState(initial.email)

  const handle = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      await onSubmit({ name, email })   // parent decides what "submit" means
      if (clearOnSubmit) { setName(''); setEmail('') }
    } catch {
      // The parent shows the error. We just keep what the person typed.
    }
  }

  return (
    <form onSubmit={handle}>
      <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} required />
      <input placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
      <button type="submit">{submitLabel}</button>
      {onCancel && <button type="button" onClick={onCancel}>Cancel</button>}
    </form>
  )
}
