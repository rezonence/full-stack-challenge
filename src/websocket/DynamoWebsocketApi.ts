import { WebSocketApi, WebSocketStage } from '@aws-cdk/aws-apigatewayv2-alpha'
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs'
import { Construct } from 'constructs'
import { WebSocketLambdaIntegration } from '@aws-cdk/aws-apigatewayv2-integrations-alpha'
import { AttributeType, Table } from 'aws-cdk-lib/aws-dynamodb'
import { Rule, Schedule } from 'aws-cdk-lib/aws-events'
import { DynamoWebsocketOptions } from './DynamoWebsocketOptions'
import { tableNameParam } from './tableNameParam'
import { TableKey } from './TableKey'
import { LambdaFunction } from 'aws-cdk-lib/aws-events-targets'
import { endpointVar } from '../polls/endpointVar'
import { connectionsTableVar } from '../polls/connectionsTableVar'
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam'
/**
 * Keeps track of websocket connections, based on https://aws.plainenglish.io/setup-api-gateway-websocket-api-with-cdk-c1e58cf3d2be
 */
export class DynamoWebsocketApi extends Construct {
    public readonly connectHandler: NodejsFunction;
    public readonly disconnectHandler: NodejsFunction;
    public readonly api: WebSocketApi;
    public readonly stage: WebSocketStage;
    public readonly table: Table;

    constructor (scope: Construct, id: string, private options: DynamoWebsocketOptions) {
      super(scope, id)

      this.table = new Table(this, `${id}Connections`, {
        ...options.tableOptions,
        partitionKey: { name: TableKey.ConnectionId, type: AttributeType.STRING }
      })
      const environment = {
        [tableNameParam]: this.table.tableName
      }
      this.connectHandler = new NodejsFunction(this, `${id}ConnectHandler`, {
        entry: require.resolve('./connect/handler'),
        environment
      })
      this.disconnectHandler = new NodejsFunction(this, `${id}DisconnectHandler`, {
        entry: require.resolve('./disconnect/handler')
      })
      for (const handler of [this.connectHandler, this.disconnectHandler]) {
        this.table.grantReadWriteData(handler)
      }
      this.api = new WebSocketApi(this, `${id}Api`, {
        connectRouteOptions: { integration: new WebSocketLambdaIntegration(`${id}ConnectIntegration`, this.connectHandler) },
        disconnectRouteOptions: { integration: new WebSocketLambdaIntegration(`${id}DisconnectIntegration`, this.disconnectHandler) }
      })
      this.stage = new WebSocketStage(this, `${id}Stage`, {
        webSocketApi: this.api,
        stageName: options.stage,
        autoDeploy: true
      })

      this.scheduleKeepAliveBroadcast(id, environment, options)
    }

    get websocketEndpoint (): string {
      return `${this.api.apiEndpoint}/${this.options.stage}`
    }

    scheduleKeepAliveBroadcast (baseId: string, environment: Record<string, string>, options: DynamoWebsocketOptions) {
      const keepAliveBroadcaster = new NodejsFunction(this, `${baseId}KeepAliveBroadcaster`, {
        entry: require.resolve('./keepalive/handler'),
        environment: {
          ...environment,
          [connectionsTableVar]: this.table.tableName,
          [endpointVar]: this.websocketEndpoint
        }
      })
      this.table.grantReadWriteData(keepAliveBroadcaster)

      keepAliveBroadcaster.addToRolePolicy(new PolicyStatement({
        effect: Effect.ALLOW,
        actions: [
          'execute-api:ManageConnections'
        ],
        resources: [
          `arn:aws:execute-api:${options.region}:${options.accountId}:${this.api.apiId}/*`
        ]
      }))

      const universalHartbeat = new Rule(this, `${baseId}KeepAliveHeartbeat`, {
        schedule: Schedule.cron({ minute: '*/8' }),
        targets: [new LambdaFunction(keepAliveBroadcaster)]
      })

      return universalHartbeat
    }
}
