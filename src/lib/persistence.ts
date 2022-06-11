import {
  DynamoDBClient,
  GetItemCommand,
  GetItemCommandInput,
} from '@aws-sdk/client-dynamodb'

const { TABLE_NAME, REGION } = process.env

export type Link = {
  url: string
  slug: string
}
export const getLink = async (slug: string): Promise<Link | null> => {
  const client = new DynamoDBClient({ region: REGION })
  const input: GetItemCommandInput = {
    TableName: TABLE_NAME,
    Key: {
      Slug: { S: slug },
    },
  }
  const command = new GetItemCommand(input)
  const link = await client.send(command)

  return link.Item
    ? {
        url: link.Item.url.S as string,
        slug: link.Item.slug.S as string,
      }
    : null
}
