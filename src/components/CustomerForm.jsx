// components/CustomerForm.jsx: owns its own input state
import { useState } from 'react'

export default function CustomerForm({ onSubmit }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  const handle = async e => {
    e.preventDefault()
    await onSubmit({ name, email })   // parent decides what "submit" means
    setName(''); setEmail('')
  }

  return (
    <form onSubmit={handle}>
      <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} required />
      <input placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
      <button type="submit">Add</button>
    </form>
  )
}