import { getReasonPhrase, StatusCodes } from 'http-status-codes'
import { AppError } from './app-error'

export class InternalError extends AppError {
  constructor() {
    super(
      getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
      StatusCodes.INTERNAL_SERVER_ERROR
    )
  }
}
