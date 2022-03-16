import { RemovalPolicy } from 'aws-cdk-lib'
import { AttributeType, StreamViewType, Table } from 'aws-cdk-lib/aws-dynamodb'
import { StartingPosition } from 'aws-cdk-lib/aws-lambda'
import { DynamoEventSource } from 'aws-cdk-lib/aws-lambda-event-sources'
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs'
import { Construct } from 'constructs'
import { CountKey } from './CountKey'
import { PollingTable } from './PollingTable'
import { PollKey } from './PollKey'
import { toTableNameVar } from './toTableNameVar'
import { VoteKey } from './VoteKey'

export class PollsConstruct extends Construct {
    public readonly tables: Record<PollingTable, Table>;
    public readonly counter: NodejsFunction;

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

      const tableTypes = Object.values(PollingTable)
      const environment = tableTypes.reduce((env, tableType) => ({
        ...env,
        [toTableNameVar(tableType)]: this.tables[tableType].tableName
      }), {} as Record<PollingTable, string>)
      this.counter = new NodejsFunction(this, `${id}Counter`, {
        entry: require.resolve('./counter/handler'),
        environment
      })
      const votesTable = this.tables[PollingTable.Votes]
      this.counter.addEventSource(new DynamoEventSource(votesTable, {
        retryAttempts: 10,
        bisectBatchOnError: true,
        batchSize: 100,
        startingPosition: StartingPosition.TRIM_HORIZON
      }))
      const countsTable = this.tables[PollingTable.Counts]
      countsTable.grantReadWriteData(this.counter)
    }
}
