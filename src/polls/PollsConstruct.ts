import { RemovalPolicy } from 'aws-cdk-lib'
import { AttributeType, StreamViewType, Table } from 'aws-cdk-lib/aws-dynamodb'
import { Construct } from 'constructs'
import { CountKey } from './CountKey'
import { PollingTable } from './PollingTable'
import { PollKey } from './PollKey'
import { VoteKey } from './VoteKey'

export class PollsConstruct extends Construct {
    public readonly tables: Record<PollingTable, Table>;

    constructor (scope: Construct, id: string) {
      super(scope, id)
      this.tables = {
          [PollingTable.Polls]: new Table(this, `${id}Polls`, {
            removalPolicy: RemovalPolicy.DESTROY,
            partitionKey: {
              name: PollKey.Id,
              type: AttributeType.STRING
            }
          }),
          [PollingTable.Votes]: new Table(this, `${id}Votes`, {
            removalPolicy: RemovalPolicy.DESTROY,
            stream: StreamViewType.NEW_IMAGE,
            sortKey: {
              name: VoteKey.IdentityId,
              type: AttributeType.STRING
            },
            partitionKey: {
              name: VoteKey.PollId,
              type: AttributeType.STRING
            }
          }),
          [PollingTable.Counts]: new Table(this, `${id}Counts`, {
            removalPolicy: RemovalPolicy.DESTROY,
            sortKey: {
              name: CountKey.Choice,
              type: AttributeType.NUMBER
            },
            partitionKey: {
              name: CountKey.PollId,
              type: AttributeType.STRING
            }
          })
      }
    }
}
