import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import { configFileName, Poll, PollKey, SiteConfig } from './src/poller'
import { Dao } from './src/poller/Dao'
import stack from './stack/stack.json'
import fetch from 'node-fetch-commonjs'

async function seed () {
  const configUrl = new URL(`${stack.Poll.websiteUrl}/${configFileName}`)
  const response = await fetch(configUrl.toString())
  const config = (await response.json()) as SiteConfig
  const db = DynamoDBDocument.from(new DynamoDBClient({
    region: config.region
  }))
  const pollDao = new Dao<Record<PollKey, string>, Poll>(db, config.pollsTableName)
  const polls: Poll[] = [
    {
      id: 'foo',
      question: 'What is your favourite snack?',
      answers: [
        'Chips',
        'Nuts',
        'Chocolate'
      ]
    }
  ]
  for (const poll of polls) {
    await pollDao.put(poll)
  }
}

seed().catch(err => {
  console.error(err)
  process.exit(1)
})
