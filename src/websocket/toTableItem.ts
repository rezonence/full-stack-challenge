import { APIGatewayProxyEvent } from 'aws-lambda'
import { TableItem } from './TableItem'

export function toTableItem (event: APIGatewayProxyEvent): TableItem {
  return {
    connectionId: event.requestContext.connectionId as string
  }
}
