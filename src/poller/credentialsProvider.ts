import { type CognitoIdentityCredentialProvider, fromCognitoIdentityPool } from '@aws-sdk/credential-providers'
import { derived } from 'svelte/store'
import { siteConfig } from './siteConfig'

export const credentialsProvider = derived<CognitoIdentityCredentialProvider>(siteConfig, config => fromCognitoIdentityPool({
  identityPoolId: config.identityPoolId,
  clientConfig: {
    region: config.region
  }
}))
