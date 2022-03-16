import { derived, type Readable } from 'svelte/store'
import { Dao } from './Dao'
import { dynamoClient } from './dynamoClient'
import type { Poll } from './Poll'
import type { PollKey } from './PollKey'
import { siteConfig } from './siteConfig'
import type { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'
import type { SiteConfig } from './SiteConfig'

type Key = Record<PollKey, string>;
export const pollsDao = derived<[Readable<DynamoDBDocumentClient>, Readable<SiteConfig>], Dao<Key, Poll>>([dynamoClient, siteConfig], (values) => new Dao<Key, Poll>(values[0], values[1].pollsTableName))
