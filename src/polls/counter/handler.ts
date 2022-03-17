import { DynamoDBStreamHandler } from 'aws-lambda'
import { DynamoDB } from 'aws-sdk'
import { AttributeMap } from 'aws-sdk/clients/dynamodb'
import { PollingTable } from '../PollingTable'
import { resolveTableName } from '../resolveTableName'
import { Vote } from '../../poller'
import { VoteCounter } from '../VoteCounter'

const ddb = new DynamoDB.DocumentClient()
const counter = new VoteCounter(ddb, resolveTableName(PollingTable.Counts) as string)

export const handler: DynamoDBStreamHandler = async event => {
  const votes = event.Records
    .filter(r => r.eventName === 'INSERT')
    .map(r => r.dynamodb?.NewImage)
    .map(v => DynamoDB.Converter.unmarshall(v as AttributeMap) as Vote)
  await counter.count(votes)
}
