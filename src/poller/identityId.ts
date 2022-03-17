import type { CognitoIdentityCredentialProvider } from '@aws-sdk/credential-providers'
import { derived, type Readable } from 'svelte/store'
import { credentialsProvider } from './credentialsProvider'

export const identityId = derived<Readable<CognitoIdentityCredentialProvider>, string>(credentialsProvider, async (provider, set) => {
    const creds = await provider();
    set(creds.identityId);
});
