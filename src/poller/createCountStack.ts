import type { Poll } from './Poll'
import { writable } from 'svelte/store'
import type { CountItem } from './CountItem'
import type { CountStack } from './CountStack'

export function createCountStack (poll: Poll): CountStack {
  let counts = poll.answers.map((answer, choice) => ({
    pollId: poll.id,
    answer,
    choice,
    count: 0
  }))
  const { subscribe, set } = writable(counts)
  const add = (newCounts: CountItem[]) => {
    const pollCounts = newCounts.filter(c => c.pollId === poll.id)
    counts = counts.map(c => ({ ...c, ...(pollCounts.find(newCount => newCount.choice === c.choice) || c) }))
    set(counts)
  }

  return {
    subscribe,
    add
  }
}
