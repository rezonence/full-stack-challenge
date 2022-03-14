import { Stack } from 'aws-cdk-lib'
import { Construct } from 'constructs'
import { CounterStackProps } from './ConterStackProps'
import { DynamoWebsocketApi } from './websocket'

export class CounterStack extends Stack {
    public readonly websocketApi: DynamoWebsocketApi;
    constructor (scope: Construct, id: string, props: CounterStackProps) {
      super(scope, id, props)
      this.websocketApi = new DynamoWebsocketApi(this, `${id}Api`, props)
    }
}
