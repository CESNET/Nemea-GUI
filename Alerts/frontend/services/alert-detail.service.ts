import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HandleServiceError } from '../shared/handle-service-error';

@Injectable({
    providedIn: 'root',
})
export class AlertDetailService {
    constructor (
        private http: HttpClient
    ) {}

    getAlertDetail(alertId: string): Observable<object> {
        let params = new HttpParams()
            .set('id', alertId);
        return this.http.get<object>('alerts/alert-detail', { params: params})
            .pipe(
                catchError(HandleServiceError.handleError('getAlertDetail', {}))
            );
    }
}
