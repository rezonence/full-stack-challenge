import { APIGatewayProxyHandler } from 'aws-lambda'
import { DynamoDB } from 'aws-sdk'
import { resolveTableName } from '../resolveTableName'
import { TableKey } from '../TableKey'

const ddb = new DynamoDB.DocumentClient()

export const handler: APIGatewayProxyHandler = async event => {
  try {
    await ddb.delete({
      TableName: resolveTableName() as string,
      Key: {
        [TableKey.Sort]: event.requestContext.connectionId
      }
    }).promise()
  } catch (err) {
    return { statusCode: 500, body: 'Failed to disconnect: ' + JSON.stringify(err) }
  }

  return { statusCode: 200, body: 'Disconnected.' }
}
