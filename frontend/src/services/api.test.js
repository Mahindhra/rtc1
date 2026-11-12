import { describe, expect, it } from 'vitest'
import { errorMessage } from './api.js'

describe('API error messages', () => {
  it('explains how to resolve an unreachable backend', () => {
    const message = errorMessage({ request: {}, code: 'ERR_NETWORK' })

    expect(message).toContain('http://localhost:8080/api')
    expect(message).toContain('Start the Spring Boot backend')
    expect(message).toContain('MySQL credentials and JWT_SECRET')
  })

  it('uses a validation message returned by the API', () => {
    expect(errorMessage({ response: { data: { message: 'Password is too short' } } })).toBe('Password is too short')
  })
})