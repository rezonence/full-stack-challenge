import { WebSocketApi } from '@aws-cdk/aws-apigatewayv2-alpha'
import { IdentityPool } from '@aws-cdk/aws-cognito-identitypool-alpha'
import { Table } from 'aws-cdk-lib/aws-dynamodb'

export interface SiteConstructOptions {
    identityPool: IdentityPool;
    configFileName: string;
    votes: Table;
    polls: Table;
    region: string;
    websocketApi: WebSocketApi;
}
