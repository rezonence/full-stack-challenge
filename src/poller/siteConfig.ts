import { writable } from 'svelte/store'
import { SiteConfig } from './SiteConfig'

export const siteConfig = writable<SiteConfig>()
