import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import App from '../App.jsx'

describe('registration form', () => {
  beforeEach(() => {
    localStorage.clear()
    window.history.pushState({}, '', '/register')
  })
  afterEach(cleanup)

  it('rejects a password confirmation that does not match', () => {
    render(<App />)
    fireEvent.change(screen.getByLabelText('Full name'), { target: { value: 'Asha Rao' } })
    fireEvent.change(screen.getByLabelText('Email address'), { target: { value: 'asha@example.com' } })
    fireEvent.change(screen.getByLabelText('Mobile number'), { target: { value: '9876543210' } })
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'secure-pass-123' } })
    fireEvent.change(screen.getByLabelText('Confirm password'), { target: { value: 'different-pass' } })
    fireEvent.click(screen.getByRole('button', { name: /create passenger account/i }))

    expect(screen.getByRole('alert')).toHaveTextContent('Passwords do not match.')
  })
})