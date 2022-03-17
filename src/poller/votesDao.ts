import { derived } from 'svelte/store'
import { config } from './config'
import { Dao } from './Dao'
import { dynamoClient } from './dynamoClient'
import type { Vote } from './Vote'
import type { VoteKey } from './VoteKey'

export const votesDao = derived([dynamoClient, config], (values) => new Dao<Record<VoteKey, string>, Vote>(values[0], values[1].tableNames.Votes))
