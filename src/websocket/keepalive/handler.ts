import { ApiGatewayManagementApi, DynamoDB } from 'aws-sdk'
import { connectionsTableVar } from '../../polls/connectionsTableVar'
import { PollBroadcaster } from '../../polls/PollBroadcaster'
import { resolveEndpoint } from '../../polls/resolveEndpoint'

const ddb = new DynamoDB.DocumentClient()
const api = new ApiGatewayManagementApi({
  endpoint: resolveEndpoint()
})

const broadcaster = new PollBroadcaster(api, ddb, process.env[connectionsTableVar] as string)

export const handler = async () => {
  await broadcaster.broadcast([])
}
