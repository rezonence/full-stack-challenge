import { APIGatewayProxyHandler } from 'aws-lambda'
import { DynamoDB } from 'aws-sdk'
import { resolveTableName } from '../resolveTableName'
import { toTableItem } from '../toTableItem'

const ddb = new DynamoDB.DocumentClient()

export const handler: APIGatewayProxyHandler = async event => {
  try {
    await ddb.put({
      TableName: resolveTableName() as string,
      Item: toTableItem(event)
    }).promise()
  } catch (err) {
    return { statusCode: 500, body: `Failed to connect: ${JSON.stringify(err)}` }
  }

  return { statusCode: 200, body: 'Connected.' }
}
