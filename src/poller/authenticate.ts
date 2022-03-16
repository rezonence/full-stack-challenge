import { CognitoIdentityClient, GetIdCommand } from '@aws-sdk/client-cognito-identity'
import { fromCognitoIdentityPool, type CognitoIdentityCredentialProvider } from '@aws-sdk/credential-provider-cognito-identity'
import { resolveSiteConfig } from './resolveSiteConfig'

export async function authenticate (): Promise<CognitoIdentityCredentialProvider> {
  const siteConfig = await resolveSiteConfig()
  console.log(siteConfig)
  const credentialProvider = fromCognitoIdentityPool({
    identityPoolId: siteConfig.identityPoolId,
    client: new CognitoIdentityClient({ region: siteConfig.region })
  })
  const client = new CognitoIdentityClient({
    credentials: credentialProvider,
    region: siteConfig.region
  })
  const data = await client.send(new GetIdCommand({
    identityPoolId: siteConfig.identityPoolId
  }))
  console.log(data)
  return credentialProvider
}
