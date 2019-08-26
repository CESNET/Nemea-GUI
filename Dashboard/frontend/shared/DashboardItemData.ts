import { DashboardItemContentType } from './DashboardItemContentType';
import { GridsterItem } from 'angular-gridster2';

export class DashboardItemData {
    gridPosition: GridsterItem;
    type: DashboardItemContentType;
    title: string;
    config: object;
}
