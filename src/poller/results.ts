import { derived, type Readable } from 'svelte/store'
import { heartbeatChar } from '../websocket/heartbeat'
import type { PollUpdates } from './PollUpdates'
import type { SiteConfig } from './SiteConfig'
import { config } from './config'

export const results = derived<Readable<SiteConfig>, PollUpdates>(config, (value, set) => {
  const socket = new WebSocket(value.websocketEndpoint)
  socket.addEventListener('open', () => {
    console.log('Socket open')
  })
  socket.addEventListener('message', event => {
    console.log('Got message:', event)
    if (event.data === heartbeatChar) {
      return
    }

    set(JSON.parse(event.data) as PollUpdates)
  })
})
