import { type CognitoIdentityCredentialProvider, fromCognitoIdentityPool } from '@aws-sdk/credential-providers'
import { derived, type Readable } from 'svelte/store'
import type { SiteConfig } from './SiteConfig'
import { config } from './config'

export const credentialsProvider = derived<Readable<SiteConfig>, CognitoIdentityCredentialProvider>(config, (value, set) => {
  if (value) {
    set(fromCognitoIdentityPool({
      identityPoolId: value.identityPoolId,
      clientConfig: {
        region: value.region
      }
    }))
  }
})
