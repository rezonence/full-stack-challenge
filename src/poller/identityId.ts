import type { CognitoIdentityCredentialProvider } from '@aws-sdk/credential-providers'
import { derived, type Readable } from 'svelte/store'
import { credentialsProvider } from './credentialsProvider'

export const identityId = derived<Readable<CognitoIdentityCredentialProvider>, string>(credentialsProvider, (provider, set) => {
  provider().then(creds => set(creds.identityId))
})
