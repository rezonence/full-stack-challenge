import { derived } from 'svelte/store'
import { config } from './config'
import { dynamoClient } from './dynamoClient'
import { VoteDao } from './VoteDao'

export const votesDao = derived([dynamoClient, config], (values) => new VoteDao(values[0], values[1].tableNames.Votes))
