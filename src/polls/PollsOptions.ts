import { TableOptions } from 'aws-cdk-lib/aws-dynamodb'

export interface PollsOptions {
    tableOptions: Partial<TableOptions>
}
