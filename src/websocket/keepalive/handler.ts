import { ApiGatewayManagementApi, DynamoDB } from 'aws-sdk'
import { connectionsTableVar } from '../../polls/connectionsTableVar'
import { resolveEndpoint } from '../../polls/resolveEndpoint'
import { ApiGwBroadcaster } from '../../utils/Broadcaster'

const ddb = new DynamoDB.DocumentClient()
const api = new ApiGatewayManagementApi({
  endpoint: resolveEndpoint()
})

class KeepAliveBroadcaster extends ApiGwBroadcaster {
  getBroadcastRequest (connectionId: string): Promise<void | void[]> {
    return this.broadcastDataToConnection(connectionId, '[]')
  }
}

const broadcaster = new KeepAliveBroadcaster(api, ddb, process.env[connectionsTableVar] as string)

export const handler = async () => {
  await broadcaster.broadcast()
}
