import { type DynamoDBDocumentClient, PutCommand, GetCommand, DeleteCommand, paginateScan } from '@aws-sdk/lib-dynamodb'

export class Dao<K, V extends K> {
  constructor (protected readonly db: DynamoDBDocumentClient, protected readonly tableName: string) {
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

  async collect<T, O> (iterable: AsyncIterable<T>, mapper: (i: T) => O): Promise<O[]> {
    const output: O[] = []
    for await (const v of iterable) {
      output.push(mapper(v))
    }
    return output
  }

  flatten<T> (input: T[][]): T[] {
    return input.reduce((collection, values) => [...collection, ...values], [])
  }

  async listAll (pageSize?: number): Promise<V[]> {
    const values = await this.collect(this.list(pageSize), v => v)
    return this.flatten(values)
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
