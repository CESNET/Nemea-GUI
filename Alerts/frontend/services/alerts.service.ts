import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AlertSimple } from '../shared/alert-simple';
import { HandleServiceError } from '../shared/handle-service-error';

@Injectable({
    providedIn: 'root',
})
export class AlertsService {
    constructor (
        private http: HttpClient
    ) {}


    getAlertCount(): Observable<number> {
        return this.http.get<number>('/alerts/alert-count')
            .pipe(
              catchError(HandleServiceError.handleError('getAlertCount', 0))
            );
    }

    getAlertPage(page: number, itemsPerPage: number): Observable<AlertSimple[]> {
        let params = new HttpParams()
            .set('page', page.toString())
            .set('items', itemsPerPage.toString());
        return this.http.get<AlertSimple[]>('alerts/alert-page',  { params: params })
            .pipe(
                catchError(HandleServiceError.handleError('getAlertPage', []))
            );
    }

    getAlertCountFiltered() {
        //TODO
    }

    getAlertPageFiltered() {
        //TODO
    }




}
