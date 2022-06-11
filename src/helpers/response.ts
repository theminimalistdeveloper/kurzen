import { APIGatewayProxyEventHeaders, APIGatewayProxyResult } from 'aws-lambda'
import { StatusCodes } from 'http-status-codes'
import { AppError } from '../errors'

export const getResponse = ({
  body,
  headers,
  statusCode,
}: {
  statusCode: typeof StatusCodes[keyof typeof StatusCodes]
  body?: any
  headers?: APIGatewayProxyEventHeaders | {}
}): APIGatewayProxyResult => ({
  body: JSON.stringify(body ?? ''),
  headers: headers ?? {},
  statusCode,
})

export const getResponseFromError = (error: AppError): APIGatewayProxyResult =>
  getResponse({
    body: { message: error.message },
    statusCode: error.httpStatusCode,
  })
