import { type CognitoIdentityCredentialProvider, fromCognitoIdentityPool } from '@aws-sdk/credential-providers'
import { derived, type Readable } from 'svelte/store'
import type { SiteConfig } from './SiteConfig'
import { siteConfig } from './siteConfig'

export const credentialsProvider = derived<Readable<SiteConfig>, CognitoIdentityCredentialProvider>(siteConfig, (config, set) => {
  if (config) {
    set(fromCognitoIdentityPool({
      identityPoolId: config.identityPoolId,
      clientConfig: {
        region: config.region
      }
    }))
  }
})
