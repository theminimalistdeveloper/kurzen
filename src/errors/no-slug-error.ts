import { StatusCodes } from 'http-status-codes'
import { AppError } from './app-error'

export class NoSlugError extends AppError {
  constructor() {
    super('No slug found', StatusCodes.BAD_REQUEST)
  }
}
