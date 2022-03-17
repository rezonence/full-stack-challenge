import { paginateQuery } from '@aws-sdk/lib-dynamodb'
import type { CountItem } from './CountItem'
import type { CountItemKey } from './CountItemKey'
import { CountKey } from './CountKey'
import { Dao } from './Dao'

export class CountDao extends Dao<CountItemKey, CountItem> {
  async findForPollId (pollId: string, pageSize = 25): Promise<CountItem[]> {
    const paginator = paginateQuery({
      client: this.db,
      pageSize
    }, {
      TableName: this.tableName,
      KeyConditionExpression: `#${CountKey.PollId} = :${CountKey.PollId}`,
      ExpressionAttributeNames: {
        [`#${CountKey.PollId}`]: CountKey.PollId
      },
      ExpressionAttributeValues: {
        [`:${CountKey.PollId}`]: pollId
      }
    })
    const items = await this.collect(paginator, r => r.Items as CountItem[] || [])
    return this.flatten(items)
  }
}
