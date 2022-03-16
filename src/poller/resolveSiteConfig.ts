import { configFileName } from './configFilename'
import type { SiteConfig } from './SiteConfig'

export async function resolveSiteConfig (): Promise<SiteConfig> {
  const siteConfigUrl = new URL(`/${configFileName}`, location.origin);
  const response = await fetch(siteConfigUrl.toString())
  return response.json()
}
