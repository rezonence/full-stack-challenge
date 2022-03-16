import type { PollKey } from './PollKey'

export interface Poll extends Record<PollKey, string> {
    question: string;
    answers: string[];
}
