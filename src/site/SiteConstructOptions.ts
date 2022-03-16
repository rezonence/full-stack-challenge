import { IdentityPool } from '@aws-cdk/aws-cognito-identitypool-alpha'
import { Table } from 'aws-cdk-lib/aws-dynamodb'

export interface SiteConstructOptions {
    identityPool: IdentityPool;
    votes: Table;
    polls: Table;
    region: string;
    websocketEndpoint: string;
    distFolder: string;
}
