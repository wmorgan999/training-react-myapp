// src/components/CustomerForm.test.jsx
import { test, expect, vi, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CustomerForm from './CustomerForm'

afterEach(cleanup)

test('submits the form values', async () => {
  const onSubmit = vi.fn()
  render(<CustomerForm onSubmit={onSubmit} />)

  await userEvent.type(screen.getByPlaceholderText('Name'), 'Ada')
  await userEvent.type(screen.getByPlaceholderText('Email'), 'ada@example.com')
  await userEvent.click(screen.getByRole('button', { name: 'Add' }))

  expect(onSubmit).toHaveBeenCalledWith({ name: 'Ada', email: 'ada@example.com' })
})

test('edit mode: starts with the given values, shows its label, can cancel', async () => {
  const onSubmit = vi.fn()
  const onCancel = vi.fn()
  render(<CustomerForm initial={{ name: 'Ada', email: 'ada@example.com' }}
    submitLabel="Save" clearOnSubmit={false} onSubmit={onSubmit} onCancel={onCancel} />)

  expect((screen.getByPlaceholderText('Name') as HTMLInputElement).value).toBe('Ada')
  await userEvent.click(screen.getByRole('button', { name: 'Save' }))
  expect(onSubmit).toHaveBeenCalledWith({ name: 'Ada', email: 'ada@example.com' })

  await userEvent.click(screen.getByRole('button', { name: 'Cancel' }))
  expect(onCancel).toHaveBeenCalled()
})

test('keeps what was typed when onSubmit fails', async () => {
  const onSubmit = vi.fn().mockRejectedValue(new Error('nope'))
  render(<CustomerForm onSubmit={onSubmit} />)

  await userEvent.type(screen.getByPlaceholderText('Name'), 'Ada')
  await userEvent.type(screen.getByPlaceholderText('Email'), 'ada@example.com')
  await userEvent.click(screen.getByRole('button', { name: 'Add' }))

  expect((screen.getByPlaceholderText('Name') as HTMLInputElement).value).toBe('Ada')   // not cleared
})
