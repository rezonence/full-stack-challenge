import { CountKey } from "./CountKey";

export interface CountItem {
    [CountKey.PollId]: string;
    [CountKey.Choice]: number;
    count: number;
}
