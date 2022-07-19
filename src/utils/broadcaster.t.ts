export interface IBroadcaster {
  getBroadcastRequest(connectionId: string): Promise<void | void[]>
}
