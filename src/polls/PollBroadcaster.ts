import { ApiGatewayManagementApi, DynamoDB } from 'aws-sdk'
import { chain } from 'lodash'
import { CountItem, CountKey, PollUpdates } from '../poller'
import { TableKey } from '../websocket'

export class PollBroadcaster {
  constructor (private api: ApiGatewayManagementApi, private db: DynamoDB.DocumentClient, private tableName: string) {
  }

  /**
     * Send all the poll result updates to all the connected clients
     * @param items
     */
  async broadcastResults (items: CountItem[]): Promise<void> {
    const pollUpdates = this.toUpdates(items)
    const scanRequest = { TableName: this.tableName }
    let response = await this.db.scan(scanRequest).promise()
    await this.broadcastToConnections(this.toConnectionIds(response.Items), pollUpdates)
    while (response.LastEvaluatedKey) {
      response = await this.db.scan({ ...scanRequest, ExclusiveStartKey: response.LastEvaluatedKey }).promise()
      await this.broadcastToConnections(this.toConnectionIds(response.Items), pollUpdates)
    }
  }

  toConnectionIds (items: DynamoDB.DocumentClient.ItemList | undefined): string[] {
    return (items || []).map(item => item[TableKey.ConnectionId] as string)
  }

  async broadcastToConnections (connectionIds: string[], updates: PollUpdates[]) {
    await Promise.all(connectionIds.map(c => this.broadcastToConnection(c, updates)))
  }

  async prune (connectionId: string): Promise<void> {
    await this.db.delete({ TableName: this.tableName, Key: { [TableKey.ConnectionId]: connectionId } }).promise()
  }

  async broadcastToConnection (connectionId: string, updates: PollUpdates[]) {
    try {
      await Promise.all(updates.map(update => this.broadcastUpdateToConnection(connectionId, update)))
    } catch (err) {
      if ((err as {statusCode: number}).statusCode === 410) {
        await this.prune(connectionId)
      } else {
        throw err
      }
    }
  }

  async broadcastUpdateToConnection (connectionId: string, update: PollUpdates): Promise<void> {
    await this.api.postToConnection({
      ConnectionId: connectionId,
      Data: update
    }).promise()
  }

  toUpdates (items: CountItem[]): PollUpdates[] {
    const uniqueCounts = chain(items).groupBy(CountKey.PollId).value()
    return Object.keys(uniqueCounts).map(pollId => ({
      pollId,
      counts: uniqueCounts[pollId].reduce((counts, item) => ({
        ...counts,
        [item.choice]: item.count
      }), {})
    }))
  }
}
