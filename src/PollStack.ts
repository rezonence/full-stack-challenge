import { RemovalPolicy, Stack } from 'aws-cdk-lib'
import { AttributeType, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs'
import { PollStackProps } from './PollStackProps'
import { DynamoWebsocketApi } from './websocket'

export class PollStack extends Stack {
    public readonly websocketApi: DynamoWebsocketApi;
    public readonly polls: Table;
    constructor (scope: Construct, id: string, props: PollStackProps) {
      super(scope, id, props)
      this.websocketApi = new DynamoWebsocketApi(this, `${id}Api`, props)
    }
}
