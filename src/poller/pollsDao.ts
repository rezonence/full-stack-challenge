import { derived } from 'svelte/store'
import { Dao } from './Dao'
import { dynamoClient } from './dynamoClient'
import type { Poll } from './Poll'
import type { PollKey } from './PollKey'
import { config } from './config'

export const pollsDao = derived([dynamoClient, config], (values) => new Dao<Record<PollKey, string>, Poll>(values[0], values[1].tableNames.Polls))
