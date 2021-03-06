import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AlertType } from '../shared/alert-type';
import { HandleServiceError } from '../shared/handle-service-error';

@Injectable({
    providedIn: 'root',
})
export class AlertStateService {
    constructor (
        private http: HttpClient
    ) {}

    setAlertType(type: AlertType, alertIds: string[]) {
        switch(type) {
            case AlertType.FalsePositive:
                return this.http.post<object>('/alerts/set-false-positive', {'ids': alertIds})
                    .pipe(
                        catchError(HandleServiceError.handleError('setAlertType', {success: false, errCode: 500}))
                    );
            case AlertType.Confirmed:
                return this.http.post<object>('/alerts/set-confirmed', {'ids': alertIds})
                    .pipe(
                        catchError(HandleServiceError.handleError('setAlertType', {success: false, errCode: 500}))
                    );
        }
    }

    deleteAlerts(alertIds: string[]) {
        return this.http.post<object>('alerts/delete-alerts', {'ids': alertIds})
            .pipe(
                catchError(HandleServiceError.handleError('deleteAlerts', {success: false, errCode: 500}))
            );
    }


}
