import type { Readable } from 'svelte/store'
import type { AnswerCount } from './AnswerCount'
import type { CountItem } from './CountItem'

export type CountStack = Readable<AnswerCount[]> & {add: (newCounts: CountItem[]) => void}
