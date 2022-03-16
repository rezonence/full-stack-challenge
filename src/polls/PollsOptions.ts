import { TableOptions, Table } from 'aws-cdk-lib/aws-dynamodb'
import { DynamoWebsocketApi } from '../websocket'

export interface PollsOptions {
    tableOptions: Partial<TableOptions>
    websocket: DynamoWebsocketApi;
    connectionsTable: Table;
    accountId: string
    region: string;
    stage: string;
}
