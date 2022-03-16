import { writable } from 'svelte/store'
import type { SiteConfig } from './SiteConfig'

export const siteConfig = writable<SiteConfig>()
