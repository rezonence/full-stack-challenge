import type { Dao } from './Dao'
import type { Vote } from './Vote'
import type { VoteKey } from './VoteKey'

export type VoteDao = Dao<Record<VoteKey, string>, Vote>;
