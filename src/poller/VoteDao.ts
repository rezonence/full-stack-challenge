import type { CognitoIdentityCredentials } from '@aws-sdk/credential-provider-cognito-identity'
import { Dao } from './Dao'
import type { Vote } from './Vote'
import type { VoteKey } from './VoteKey'

export class VoteDao extends Dao<Record<VoteKey, string>, Vote> {
  async identityId (): Promise<string | undefined> {
    const currentCredentials = await this.db.config.credentials()
    const cognitoCredentials = currentCredentials as CognitoIdentityCredentials
    return cognitoCredentials.identityId
  }

  async fill<T extends Partial<Vote>> (request: Omit<T, 'identityId'>): Promise<T> {
    const identityId = await this.identityId()
    return {
      identityId,
      ...request
    } as T
  }

  async getForPoll (pollId: string): Promise<Vote | undefined> {
    return this.getValue(await this.fill({ pollId }))
  }

  async vote (request: Omit<Vote, 'identityId'>): Promise<Vote> {
    const value = await this.fill(request)
    await this.put(value)
    return value
  }
}
