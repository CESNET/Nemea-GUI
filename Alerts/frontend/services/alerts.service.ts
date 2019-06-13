import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AlertSimple } from '../shared/alert-simple';
import { HandleServiceError } from '../shared/handle-service-error';
import { Filter } from '../shared/filter';
import { AlertSet } from '../shared/alert-set';

@Injectable({
    providedIn: 'root',
})
export class AlertsService {
    constructor (
        private http: HttpClient
    ) {}

    getAlertPage(page: number, itemsPerPage: number): Observable<AlertSet> {
        let params = new HttpParams()
            .set('page', page.toString())
            .set('items', itemsPerPage.toString());
        return this.http.get<AlertSet>('alerts/alert-page',  { params: params })
            .pipe(
                catchError(HandleServiceError.handleError('getAlertPage', {'count': 0, 'data': []}))
            );
    }


    getAlertPageFiltered(page: number, itemsPerPage: number, filter: Filter[]) {
        return this.http.post<AlertSet>('alerts/alert-filtered', {'page': page, 'items': itemsPerPage, 'filter': filter})
            .pipe (
                catchError(HandleServiceError.handleError('getAlertPageFiltered', {'count': 0, 'data': []}))
            );
    }




}
