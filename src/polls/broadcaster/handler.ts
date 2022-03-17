import { DynamoDBStreamHandler, StreamRecord } from 'aws-lambda'
import { ApiGatewayManagementApi, DynamoDB } from 'aws-sdk'
import { AttributeMap } from 'aws-sdk/clients/dynamodb'
import { PollBroadcaster } from '../PollBroadcaster'
import { PollingTable } from '../PollingTable'
import { resolveEndpoint } from '../resolveEndpoint'
import { resolveTableName } from '../resolveTableName'
import { orderBy, uniqBy } from 'lodash'
import { CountItem } from '../../poller'

const ddb = new DynamoDB.DocumentClient()
const api = new ApiGatewayManagementApi({
  endpoint: resolveEndpoint()
})
const broadcaster = new PollBroadcaster(api, ddb, resolveTableName(PollingTable.Counts) as string)

function toLatestUniqueCounts (records: StreamRecord[]): CountItem[] {
  const counts = orderBy(records, ['ApproximateCreationDateTime'], ['desc'])
    .map(r => r?.NewImage)
    .map(v => DynamoDB.Converter.unmarshall(v as AttributeMap) as CountItem)
  return uniqBy(counts, c => `${c.pollId}:${c.choice}`)
}

export const handler: DynamoDBStreamHandler = async event => {
  const updatedRecords = event.Records
    .filter(r => ['MODIFY', 'INSERT'].includes(r.eventName as string))
    .map(r => r.dynamodb)
    .filter(v => !!v)
    .map(v => v as StreamRecord)

  await broadcaster.broadcastResults(toLatestUniqueCounts(updatedRecords))
}
