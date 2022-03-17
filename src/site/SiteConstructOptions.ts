import { IdentityPool } from '@aws-cdk/aws-cognito-identitypool-alpha'
import { Table } from 'aws-cdk-lib/aws-dynamodb'
import { PollingTable } from '../poller'

export interface SiteConstructOptions {
    identityPool: IdentityPool;
    tables: Record<PollingTable, Table>
    region: string;
    websocketEndpoint: string;
    distFolder: string;
}
