import { PollingTable } from './PollingTable'

export function toTableNameVar (type: PollingTable): string {
  return `${type}_NAME`
}
