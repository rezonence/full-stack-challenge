import { tableNameParam } from './tableNameParam'

export function resolveTableName (): string | undefined {
  return process.env[tableNameParam]
}
