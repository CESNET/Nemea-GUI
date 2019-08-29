import { DashboardItemContentType } from './DashboardItemContentType';

export class DashboardItemConfig {
    title: string;
    viewType: DashboardItemContentType;
    timeWindow: number;
    aggregation?: number;
    description: string;
    flowCount?: string;
    category: string; // TODO: Implement this everywhere
}
