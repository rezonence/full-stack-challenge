import { PollingTable } from './PollingTable'

export function resolveTableName (type: PollingTable): string | undefined {
  return process.env[`${type}_NAME`]
}
