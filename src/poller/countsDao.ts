import { derived } from "svelte/store";
import { config } from "./config";
import type { CountItem } from "./CountItem";
import type { CountItemKey } from "./CountItemKey";
import { Dao } from "./Dao";
import { dynamoClient } from "./dynamoClient";

export const countsDao = derived([dynamoClient, config], (values) => new Dao<CountItemKey, CountItem>(values[0], values[1].tableNames.Counts))
