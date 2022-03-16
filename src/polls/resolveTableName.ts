import { PollingTable } from './PollingTable'
import { toTableNameVar } from './toTableNameVar'

export function resolveTableName (type: PollingTable): string | undefined {
  return process.env[toTableNameVar(type)]
}
