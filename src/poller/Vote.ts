import type { VoteKey } from './VoteKey'

export interface Vote extends Record<VoteKey, string> {
    choice: number;
}
