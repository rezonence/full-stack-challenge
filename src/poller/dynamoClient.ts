import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import { derived } from 'svelte/store'
import { config } from './config'
import { credentialsProvider } from './credentialsProvider'

export const dynamoClient = derived([credentialsProvider, config], values => DynamoDBDocument.from(new DynamoDBClient({
  credentials: values[0],
  region: values[1].region
}), {
  marshallOptions: {
    convertEmptyValues: true,
    removeUndefinedValues: true
  }
}))
