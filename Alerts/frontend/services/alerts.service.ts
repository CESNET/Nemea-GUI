import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AlertSimple } from '../shared/alert-simple';

@Injectable({
    providedIn: 'root',
})
export class AlertsService {
    constructor (
        private http: HttpClient
    ) {}


    getAlertCount(): Observable<object> {
        return this.http.get<object>('/alerts/alert-count')
            .pipe(
              catchError(this.handleError('getAlertCount', {"number_of_records": 0}))
            );
    }

    getAlertPage(page: number, itemsPerPage: number): Observable<AlertSimple[]> {
        let params = new HttpParams()
            .set('page', page.toString())
            .set('items', itemsPerPage.toString());
        return this.http.get<AlertSimple[]>('alerts/alert-page',  { params: params })
            .pipe(
                catchError(this.handleError('getAlertPage', []))
            );
    }

    getAlertCountFiltered() {
        //TODO
    }

    getAlertPageFiltered() {
        //TODO
    }


    private handleError<T> (operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            console.error('Failed on ' + operation + '. Error details:');
            console.error(error);
            //TODO: Notify user in GUI
            return of(result as T);
        };
    }
}
