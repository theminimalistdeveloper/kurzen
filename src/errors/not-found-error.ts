import { StatusCodes, getReasonPhrase } from 'http-status-codes'
import { AppError } from './app-error'

export class NotFoundError extends AppError {
  constructor() {
    super(getReasonPhrase(StatusCodes.NOT_FOUND), StatusCodes.NOT_FOUND)
  }
}
