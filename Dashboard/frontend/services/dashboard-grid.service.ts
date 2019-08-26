import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GridsterItem } from 'angular-gridster2';
import { UUID } from 'angular2-uuid';
import { catchError } from 'rxjs/operators';
import { DashboardItemData } from '../shared/DashboardItemData';
import { HandleServiceError } from '../shared/handle-service-error';

@Injectable({
    providedIn: 'root'
})
export class DashboardGridService {
    public layout: DashboardItemData[] = [];
    public layoutChangedEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor(private http: HttpClient) { }

    addItem(options: object): void {
        let tmp: GridsterItem = {
            cols: 2,
            id: UUID.UUID(),
            rows: 2,
            x: 0,
            y: 0
        };
        let data: DashboardItemData = {
            config: options,
            title: options['title'],
            gridPosition: tmp,
            type: +options['viewType']
        };
        this.layout.push(data);
        this.layoutChangedEvent.emit(true);
    }

    editItem(data: DashboardItemData) {
        const item = this.layout.find(d => d.gridPosition.id === data.gridPosition.id);
        this.layout.splice(this.layout.indexOf(item), 1);
        this.layout.push(data);
        this.layoutChangedEvent.emit(true);
    }

    deleteItem(id: string): void {
        const item = this.layout.find(d => d.gridPosition.id === id);
        this.layout.splice(this.layout.indexOf(item), 1);
        this.layoutChangedEvent.emit(true);
    }

    loadDashboard(dashName: string) {
        this.load(dashName).subscribe(data => {
            this.layout = data;
            this.layoutChangedEvent.emit(true);
        });

    }

    load(gridName: string) {
        return this.http.get<DashboardItemData[]>('/dashboard/grid/' + gridName)
            .pipe(
                catchError(HandleServiceError.handleError('load', []))
            );
    }

    save(gridName: string) {
        return this.http.post<object>('/dashboard/grid/' + gridName, {'data': this.layout})
            .pipe(
                catchError(HandleServiceError.handleError('save', {"success": false}))
            );
    }
}
