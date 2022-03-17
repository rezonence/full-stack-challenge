import type { CountKey } from './CountKey'

export interface CountItemKey {
    [CountKey.PollId]: string;
    [CountKey.Choice]: number;
}
