import { ApiGatewayManagementApi, DynamoDB } from 'aws-sdk'
import { TableKey } from '../websocket'
import { IBroadcaster } from './broadcaster.t'

export class ApiGwBroadcaster implements IBroadcaster {
  constructor (private api: ApiGatewayManagementApi, private db: DynamoDB.DocumentClient, private tableName: string) {}

  getBroadcastRequest (connectionId: string): Promise<void | void[]> {
    throw new Error(`(${connectionId}) Method not implemented.`)
  }

  async broadcast () {
    const scanRequest = { TableName: this.tableName }
    let response = await this.db.scan(scanRequest).promise()

    await this.broadcastToConnections(this.toConnectionIds(response.Items))
    while (response.LastEvaluatedKey) {
      response = await this.db.scan({ ...scanRequest, ExclusiveStartKey: response.LastEvaluatedKey }).promise()
      await this.broadcastToConnections(this.toConnectionIds(response.Items))
    }
  }

  toConnectionIds (items: DynamoDB.DocumentClient.ItemList | undefined): string[] {
    return (items || []).map(item => item[TableKey.ConnectionId] as string)
  }

  async broadcastToConnections (connectionIds: string[]) {
    await Promise.all(connectionIds.map(this.broadcastToConnection.bind(this)))
  }

  async broadcastToConnection (connectionId: string) {
    try {
      await this.getBroadcastRequest(connectionId)
    } catch (err) {
      if ((err as {statusCode: number}).statusCode === 410) {
        await this.prune(connectionId)
      } else {
        throw err
      }
    }
  }

  async prune (connectionId: string): Promise<void> {
    await this.db.delete({ TableName: this.tableName, Key: { [TableKey.ConnectionId]: connectionId } }).promise()
  }

  async broadcastDataToConnection (ConnectionId: string, Data: string): Promise<void> {
    await this.api.postToConnection({ ConnectionId, Data }).promise()
  }
}
