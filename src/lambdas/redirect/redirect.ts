import { APIGatewayProxyResult, APIGatewayProxyEventV2 } from 'aws-lambda'
import { StatusCodes } from 'http-status-codes'
import { getResponse, getResponseFromError } from '../../helpers/response'
import { getLink } from '../../helpers/persistence'
import {
  AppError,
  NoSlugError,
  NotFoundError,
  InternalError,
} from '../../errors'

export const handler = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResult> => {
  try {
    const slug = event.rawPath.split('/')[1]

    if (!slug) {
      throw new NoSlugError()
    }

    const link = await getLink(slug)

    if (!link) {
      throw new NotFoundError()
    }

    return getResponse({
      statusCode: StatusCodes.MOVED_PERMANENTLY,
      headers: { Location: link.url as string },
    })
  } catch (error) {
    console.error(error)
    return getResponseFromError(
      error instanceof AppError ? error : new InternalError()
    )
  }
}
