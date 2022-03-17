import { derived } from 'svelte/store'
import { config } from './config'
import { CountDao } from './CountDao'
import { dynamoClient } from './dynamoClient'

export const countsDao = derived([dynamoClient, config], (values) => new CountDao(values[0], values[1].tableNames.Counts))
