import { PollingTable } from '../poller'

export function toTableNameVar (type: PollingTable): string {
  return `${type}_NAME`
}
