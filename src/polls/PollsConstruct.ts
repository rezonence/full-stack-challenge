import { Duration } from 'aws-cdk-lib'
import { AttributeType, StreamViewType, Table, TableOptions } from 'aws-cdk-lib/aws-dynamodb'
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam'
import { StartingPosition } from 'aws-cdk-lib/aws-lambda'
import { DynamoEventSource } from 'aws-cdk-lib/aws-lambda-event-sources'
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs'
import { Construct } from 'constructs'
import { endpointVar } from './endpointVar'
import { PollingTable } from './PollingTable'
import { CountKey, PollKey, VoteKey } from '../poller'
import { PollsOptions } from './PollsOptions'
import { toTableNameVar } from './toTableNameVar'

export class PollsConstruct extends Construct {
  public readonly tables: Record<PollingTable, Table>;
  public readonly counter: NodejsFunction;
  public readonly broadcaster: NodejsFunction;

  constructor (scope: Construct, id: string, options: PollsOptions) {
    super(scope, id)
    const tableOptions = options.tableOptions
    this.tables = this.createTables(id, tableOptions)
    const tableTypes = Object.values(PollingTable)
    const environment = tableTypes.reduce((env, tableType) => ({
      ...env,
      [toTableNameVar(tableType)]: this.tables[tableType].tableName
    }), {} as Record<PollingTable, string>)
    this.counter = new NodejsFunction(this, `${id}Counter`, {
      entry: require.resolve('./counter/handler'),
      environment,
      timeout: Duration.minutes(1)
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

    this.broadcaster = new NodejsFunction(this, `${id}Broadcaster`, {
      entry: require.resolve('./broadcaster/handler'),
      environment: {
        ...environment,
        [endpointVar]: options.websocket.websocketEndpoint
      },
      timeout: Duration.minutes(5)
    })
    this.broadcaster.addEventSource(new DynamoEventSource(countsTable, {
      retryAttempts: 10,
      bisectBatchOnError: true,
      batchSize: 1000,
      startingPosition: StartingPosition.TRIM_HORIZON
    }))
    options.connectionsTable.grantReadWriteData(this.broadcaster)
    this.broadcaster.addToRolePolicy(new PolicyStatement({
      effect: Effect.ALLOW,
      actions: [
        'execute-api:ManageConnections'
      ],
      resources: [
        `arn:aws:execute-api:${options.region}:${options.accountId}:${options.websocket.api.apiId}/*`
      ]
    }))
  }

  createTables (baseId: string, tableOptions: Partial<TableOptions>): Record<PollingTable, Table> {
    return {
      [PollingTable.Polls]: new Table(this, `${baseId}Polls`, {
        ...tableOptions,
        partitionKey: {
          name: PollKey.Id,
          type: AttributeType.STRING
        }
      }),
      [PollingTable.Votes]: new Table(this, `${baseId}Votes`, {
        ...tableOptions,
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
      [PollingTable.Counts]: new Table(this, `${baseId}Counts`, {
        ...tableOptions,
        stream: StreamViewType.NEW_IMAGE,
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
