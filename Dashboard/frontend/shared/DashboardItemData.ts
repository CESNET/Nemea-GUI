import { DashboardItemContentType } from './DashboardItemContentType';
import { GridsterItem } from 'angular-gridster2';
import { DashboardItemConfig } from './DashboardItemConfig';

export class DashboardItemData {
    gridPosition: GridsterItem;
    type: DashboardItemContentType;
    title: string;
    config: DashboardItemConfig;
}
