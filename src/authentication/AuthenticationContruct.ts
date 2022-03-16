import { IdentityPool } from '@aws-cdk/aws-cognito-identitypool-alpha'
import { Construct } from 'constructs'

export class AuthenticationConstruct extends Construct {
    public readonly identityPool: IdentityPool;

    constructor (scope: Construct, id: string) {
      super(scope, id)
      this.identityPool = new IdentityPool(this, `${id}IdentityPool`, {
        allowUnauthenticatedIdentities: true
      })
    }
}
