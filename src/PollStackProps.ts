import { StackProps } from 'aws-cdk-lib'
import { TableOptions } from 'aws-cdk-lib/aws-dynamodb'

export interface PollStackProps extends StackProps {
  stage: string;
  tableOptions: Partial<TableOptions>;
}
