// src/components/CustomerForm.test.jsx
import { test, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CustomerForm from './CustomerForm'

test('submits the form values', async () => {
  const onSubmit = vi.fn()
  render(<CustomerForm onSubmit={onSubmit} />)

  await userEvent.type(screen.getByPlaceholderText('Name'), 'Ada')
  await userEvent.type(screen.getByPlaceholderText('Email'), 'ada@example.com')
  await userEvent.click(screen.getByRole('button', { name: 'Add' }))

  expect(onSubmit).toHaveBeenCalledWith({ name: 'Ada', email: 'ada@example.com' })
})