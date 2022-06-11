export class AppError extends Error {
  httpStatusCode: number
  constructor(message: string, httpStatusCode: number) {
    super(message)
    this.httpStatusCode = httpStatusCode
  }
}
