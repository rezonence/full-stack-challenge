import { RemovalPolicy } from 'aws-cdk-lib'
import { BillingMode, TableOptions} from 'aws-cdk-lib/aws-dynamodb'

export const defaultTableOptions: Partial<TableOptions> = {
    billingMode: BillingMode.PAY_PER_REQUEST,
    removalPolicy: RemovalPolicy.DESTROY
}
