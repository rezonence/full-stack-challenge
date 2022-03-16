import { configFileName } from './configFilename'
import type { SiteConfig } from './SiteConfig'

export async function resolveSiteConfig (): Promise<SiteConfig> {
  const response = await fetch(`/${configFileName}`)
  return response.json()
}
