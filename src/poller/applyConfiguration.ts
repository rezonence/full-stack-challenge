import { resolveSiteConfig } from './resolveSiteConfig'
import { siteConfig } from './siteConfig'

export async function applyConfiguration () {
  const config = await resolveSiteConfig()
  siteConfig.set(config)
}
