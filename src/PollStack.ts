import { Stack } from 'aws-cdk-lib'
import { Construct } from 'constructs'
import { PollStackProps } from './PollStackProps'
import { DynamoWebsocketApi } from './websocket'
import { PollsConstruct } from './polls'

export class PollStack extends Stack {
    public readonly websocketApi: DynamoWebsocketApi;
    public readonly polls: PollsConstruct;
    constructor (scope: Construct, id: string, props: PollStackProps) {
      super(scope, id, props)
      this.websocketApi = new DynamoWebsocketApi(this, `${id}Api`, props)
      this.polls = new PollsConstruct(this, `${id}Data`, props)
    }
}
