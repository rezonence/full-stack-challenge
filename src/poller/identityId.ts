import type { CognitoIdentityCredentialProvider } from '@aws-sdk/credential-providers'
import { derived, type Readable } from 'svelte/store'
import { credentialsProvider } from './credentialsProvider'
import { config } from './config'
import type { SiteConfig } from './SiteConfig'

export const identityId = derived<[Readable<CognitoIdentityCredentialProvider>, Readable<SiteConfig>], string>([credentialsProvider, config], (values, set) => {
  values[0]().then(creds => set(creds.identityId))
})
