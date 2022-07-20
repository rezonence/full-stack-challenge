import { ApiGatewayManagementApi, DynamoDB } from 'aws-sdk'
import { chain } from 'lodash'
import { TableKey } from './TableKey'

export class WebsocketBroadcaster<T> {
  protected BROADCAST_BATCH_SIZE = 10

  constructor (private api: ApiGatewayManagementApi, private db: DynamoDB.DocumentClient, private tableName: string) {}

  async broadcast (payload: T) {
    const scanRequest = { TableName: this.tableName }
    let response = await this.db.scan(scanRequest).promise()

    await this.broadcastToConnections(this.toConnectionIds(response.Items), payload)
    while (response.LastEvaluatedKey) {
      response = await this.db.scan({ ...scanRequest, ExclusiveStartKey: response.LastEvaluatedKey }).promise()
      await this.broadcastToConnections(this.toConnectionIds(response.Items), payload)
    }
  }

  toConnectionIds (items: DynamoDB.DocumentClient.ItemList | undefined): string[] {
    return (items || []).map(item => item[TableKey.ConnectionId] as string)
  }

  async broadcastToConnections (connectionIds: string[], payload: T) {
    await Promise.all(connectionIds.map(c => this.broadcastToConnection(c, payload)))
  }

  async broadcastToConnection (connectionId: string, payload: T) {
    const updates = chain([])
      .concat(payload as never)
      .chunk(this.BROADCAST_BATCH_SIZE)
      .value()
    
    const broadcastPromises = updates.map(
      update => this.broadcastDataToConnection(connectionId, JSON.stringify(update))
    )
    try {
      await Promise.all(broadcastPromises)
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
