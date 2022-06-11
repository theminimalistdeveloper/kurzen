import { APIGatewayProxyEventV2 } from 'aws-lambda'
import _ from 'lodash'
import { handler } from './redirect'
import { getResponse, getResponseFromError } from '../../helpers/response'
import { getLink } from '../../lib/persistence'

jest.mock('../../helpers/response')
jest.mock('../../lib/persistence')

const getResponseMock = getResponse as jest.Mock
const getResponseFromErrorMock = getResponseFromError as jest.Mock
const getLinkMock = getLink as jest.Mock

type Override<Type> = {
  [P in keyof Type]?: Type[P]
}

const getEvent = (
  override: Override<APIGatewayProxyEventV2>
): APIGatewayProxyEventV2 => {
  const event: APIGatewayProxyEventV2 = {
    version: '2.0',
    routeKey: '$default',
    rawPath: '/slug',
    rawQueryString: '',
    cookies: [],
    headers: {
      Accept: 'text/html',
    },
    queryStringParameters: {},
    requestContext: {
      accountId: '123456789012',
      apiId: '<urlid>',
      authentication: undefined,
      domainName: '<url-id>.lambda-url.us-west-2.on.aws',
      domainPrefix: '<url-id>',
      http: {
        method: 'GET',
        path: '/slug',
        protocol: 'HTTP/2.0',
        sourceIp: '123.123.123.123',
        userAgent: 'agent',
      },
      requestId: 'id',
      routeKey: '$default',
      stage: '$default',
      time: '12/Mar/2020:19:03:58 +0000',
      timeEpoch: 1583348638390,
    },
    body: 'Hello from client!',
    pathParameters: undefined,
    isBase64Encoded: false,
    stageVariables: undefined,
  }

  return _.merge(event, override)
}

beforeEach(() => {
  jest.clearAllMocks()
})

test('Find a link and provide redirect', async () => {
  const url = 'http://www.domain.com'
  const expectedLinkResponse = { url }
  const slug = 'slug-to-redirect'

  const event = getEvent({
    rawPath: `/${slug}`,
  })

  const expectedResponse = {
    statusCode: 301,
    headers: { Location: url },
  }

  getResponseMock.mockReturnValue(expectedResponse)
  getLinkMock.mockReturnValue(expectedLinkResponse)

  const response = await handler(event)

  expect(getLinkMock).toHaveBeenCalledTimes(1)
  expect(getLinkMock).toHaveBeenCalledWith(slug)

  expect(getResponseMock).toHaveBeenCalledWith(expectedResponse)

  expect(response).toEqual(expectedResponse)
})

test('Cannot find link returns 404', async () => {
  const slug = 'slug-to-redirect'

  const event = getEvent({
    rawPath: `/${slug}`,
  })

  const expectedResponse = { statusCode: 404 }

  getResponseFromErrorMock.mockReturnValue(expectedResponse)
  getLinkMock.mockReturnValue(null)

  const response = await handler(event)

  expect(getLinkMock).toHaveBeenCalledTimes(1)
  expect(getLinkMock).toHaveBeenCalledWith(slug)

  expect(getResponseFromError).toHaveBeenCalledTimes(1)

  expect(response).toEqual(expectedResponse)
})

test('Slug not provided returns 400', async () => {
  const event = getEvent({
    rawPath: '',
  })

  const expectedResponse = { statusCode: 400, body: 'No slug provided' }

  getResponseFromErrorMock.mockReturnValue(expectedResponse)

  const response = await handler(event)

  expect(getLinkMock).toHaveBeenCalledTimes(0)
  expect(getResponseFromErrorMock).toHaveBeenCalledTimes(1)

  expect(response).toEqual(expectedResponse)
})

test('General internal error due thrown exception', async () => {
  getLinkMock.mockImplementation(() => {
    throw new Error('Error')
  })
  getResponseFromErrorMock.mockReturnValue({ statusCode: 500 })

  expect(await handler(getEvent({}))).toEqual({ statusCode: 500 })
  expect(getResponseFromErrorMock).toHaveBeenCalledTimes(1)
})
