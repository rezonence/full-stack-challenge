import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { derived } from 'svelte/store'
import { credentialsProvider } from './credentialsProvider'

export const dynamoClient = derived(credentialsProvider, creds => new DynamoDBClient({
  credentials: creds
}))
