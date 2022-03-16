import { endpointVar } from './endpointVar'

export function resolveEndpoint (): string | undefined {
  return process.env[endpointVar]
}
