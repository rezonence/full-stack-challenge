import { derived, type Readable } from 'svelte/store'
import type { PollUpdates } from './PollUpdates'
import type { SiteConfig } from './SiteConfig'
import { siteConfig } from './siteConfig'

export const pollUpdates = derived<Readable<SiteConfig>, PollUpdates>(siteConfig, (config, set) => {
  const socket = new WebSocket(config.websocketEndpoint)
  socket.addEventListener('open', () => {
    console.log('Socket open')
  })
  socket.addEventListener('message', event => {
    set(event.data as PollUpdates)
  })
})
