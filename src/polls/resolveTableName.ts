import { PollingTable } from '../poller'
import { toTableNameVar } from './toTableNameVar'

export function resolveTableName (type: PollingTable): string | undefined {
  return process.env[toTableNameVar(type)]
}
