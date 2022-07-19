import { chain } from 'lodash'
import { ApiGwBroadcaster } from '../utils/Broadcaster'
import { CountItem, CountKey, PollUpdates } from '../poller'

export class PollBroadcaster extends ApiGwBroadcaster {
  private pollUpdates: PollUpdates[] = []
  /**
     * Send all the poll result updates to all the connected clients
     * @param items
     */
  async broadcastResults (items: CountItem[]): Promise<void> {
    this.pollUpdates = this.toUpdates(items)
    await this.broadcast()
  }

  async getBroadcastRequest (connectionId: string): Promise<void[]> {
    const updates = this.pollUpdates.map(
      update => this.broadcastDataToConnection(connectionId, JSON.stringify(update))
    )

    return Promise.all(updates)
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
