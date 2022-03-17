import type { PollingTable } from './PollingTable'

export interface SiteConfig {
    identityPoolId: string;
    tableNames: Record<PollingTable, string>;
    region: string;
    websocketEndpoint: string;
}
