import { fromCognitoIdentityPool, type CognitoIdentityCredentialProvider } from '@aws-sdk/credential-providers'
import { derived, type Readable } from 'svelte/store'
import { config } from './config'
import type { SiteConfig } from './SiteConfig'

export const credentialsProvider = derived<Readable<SiteConfig>, CognitoIdentityCredentialProvider>(config, value => fromCognitoIdentityPool({
  identityPoolId: value.identityPoolId,
  clientConfig: {
    region: value.region
  }
}))
