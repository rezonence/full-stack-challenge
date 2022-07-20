import { ApiGatewayManagementApi, DynamoDB } from 'aws-sdk'
import { connectionsTableVar } from '../../polls/connectionsTableVar'
import { resolveEndpoint } from '../../polls/resolveEndpoint'
import { WebsocketBroadcaster } from '../Broadcaster'

const ddb = new DynamoDB.DocumentClient()
const api = new ApiGatewayManagementApi({
  endpoint: resolveEndpoint()
})

const broadcaster = new WebsocketBroadcaster(api, ddb, process.env[connectionsTableVar] as string)

export const handler = async () => {
  await broadcaster.broadcast([])
}
