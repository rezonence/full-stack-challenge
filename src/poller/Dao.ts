import { type DynamoDBDocumentClient, PutCommand, GetCommand, DeleteCommand, paginateScan } from '@aws-sdk/lib-dynamodb'

export class Dao<K, V extends K> {
  constructor (private db: DynamoDBDocumentClient, private tableName: string) {
  }

  async * list (pageSize: number = 25): AsyncIterable<V[]> {
    const paginator = paginateScan({
      client: this.db,
      pageSize
    }, { TableName: this.tableName })
    for await (const response of paginator) {
      yield response.Items as V[]
    }
  }

  async put (value: V): Promise<void> {
    await this.db.send(new PutCommand({
      TableName: this.tableName,
      Item: value
    }))
  }

  async getValue (key: K): Promise<V> {
    const response = await this.db.send(new GetCommand({
      TableName: this.tableName,
      Key: key
    }))
    return response.Item as V
  }

  async deleteValue (key: K): Promise<void> {
    await this.db.send(new DeleteCommand({
      TableName: this.tableName,
      Key: key
    }))
  }
}
