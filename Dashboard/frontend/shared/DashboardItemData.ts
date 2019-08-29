import { DashboardItemContentType } from './DashboardItemContentType';
import { GridsterItem } from 'angular-gridster2';
import { DashboardItemConfig } from './DashboardItemConfig';

export class DashboardItemData {
    gridPosition: GridsterItem;
    title: string;
    config: DashboardItemConfig;
}
