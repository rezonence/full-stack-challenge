import { resolveSiteConfig } from './resolveSiteConfig'
import { config } from './config'

export async function applyConfiguration () {
  const siteConfig = await resolveSiteConfig()
  config.set(siteConfig)
}
