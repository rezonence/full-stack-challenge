import { endpointVar } from './endpointVar'

export function resolveEndpoint (): string {
  const url = new URL(process.env[endpointVar] as string)
  // Strip out the protocol from the endpoint URL
  return url.hostname + url.pathname
}
