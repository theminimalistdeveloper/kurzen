import * as response from './response'
import { NotFoundError } from '../errors/not-found-error'

describe('getResponseFromError', () => {
  test('accepts custom error and build correct response', () => {
    const notFoundError = new NotFoundError()
    const r = response.getResponseFromError(notFoundError)
    expect(r).toEqual({
      body: JSON.stringify({ message: 'Not Found' }),
      headers: {},
      statusCode: 404,
    })
  })
})

describe('getResponse', () => {
  test('return proper response', () => {
    const m = { message: 'ok' }
    const p = {
      body: m,
      headers: { 'Content-Type': 'application/json' },
      statusCode: 200,
    }
    expect(response.getResponse(p)).toEqual({
      body: JSON.stringify(m),
      headers: { 'Content-Type': 'application/json' },
      statusCode: 200,
    })
  })
})

describe('getResponse with invalid body', () => {
  test('return proper response', () => {
    const p = {
      body: null,
      headers: { 'Content-Type': 'application/json' },
      statusCode: 200,
    }
    expect(response.getResponse(p)).toEqual({
      body: JSON.stringify(''),
      headers: { 'Content-Type': 'application/json' },
      statusCode: 200,
    })
  })
})
