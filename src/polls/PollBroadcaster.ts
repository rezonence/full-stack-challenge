import { chain } from 'lodash'
import { WebsocketBroadcaster } from '../websocket/Broadcaster'
import { CountItem, CountKey, PollUpdates } from '../poller'

export class PollBroadcaster extends WebsocketBroadcaster<PollUpdates[]> {
  /**
     * Send all the poll result updates to all the connected clients
     * @param items
     */
  async broadcastResults (items: CountItem[]): Promise<void> {
    const pollUpdates = this.toUpdates(items)
    await this.broadcast(pollUpdates)
  }

  toUpdates (items: CountItem[]): PollUpdates[] {
    const uniqueCounts = chain(items).groupBy(CountKey.PollId).value()
    return Object.keys(uniqueCounts).map(pollId => ({
      pollId,
      counts: uniqueCounts[pollId].reduce((counts, item) => ({
        ...counts,
        [item.choice]: item.count
      }), {})
    }))
  }
}
