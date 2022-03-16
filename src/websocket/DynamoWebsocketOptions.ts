import { TableOptions } from 'aws-cdk-lib/aws-dynamodb'

export interface DynamoWebsocketOptions {
    stage: string;
    tableOptions: Partial<TableOptions>;
}
