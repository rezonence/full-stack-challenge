import { CfnOutput, Stack } from 'aws-cdk-lib'
import { Construct } from 'constructs'
import { PollStackProps } from './PollStackProps'
import { DynamoWebsocketApi } from './websocket'
import { PollsConstruct } from './polls'
import { AuthenticationConstruct } from './authentication'
import { SiteConstruct } from './site'
import { resolve } from 'path'

export class PollStack extends Stack {
    public readonly websocketApi: DynamoWebsocketApi;
    public readonly polls: PollsConstruct;
    public readonly authentication: AuthenticationConstruct;
    public readonly site: SiteConstruct;
    public readonly websiteOutput;
    constructor (scope: Construct, id: string, props: PollStackProps) {
      super(scope, id, props)
      this.websocketApi = new DynamoWebsocketApi(this, `${id}Api`, props)
      const websocketEndpoint = this.websocketApi.websocketEndpoint
      this.polls = new PollsConstruct(this, `${id}Data`, {
        ...props,
        connectionsTable: this.websocketApi.table,
        websocket: this.websocketApi,
        region: this.region,
        accountId: this.account
      })
      this.authentication = new AuthenticationConstruct(this, `${id}Auth`)
      this.site = new SiteConstruct(this, `${id}Site`, {
        identityPool: this.authentication.identityPool,
        tables: this.polls.tables,
        region: this.region,
        websocketEndpoint,
        distFolder: resolve(__dirname, '..', 'dist')
      })
      this.websiteOutput = new CfnOutput(this, 'websiteUrl', { value: `https://${this.site.distribution.domainName}` })
    }
}
