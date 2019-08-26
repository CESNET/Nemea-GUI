import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HandleServiceError } from '../shared/handle-service-error';

@Injectable({
    providedIn: 'root'
})
export class DashboardsService {
    constructor(private http: HttpClient) {}


    addDashboard(name: string) {
        return this.http.post<object>('/dashboard/add', {'dashboard': name})
            .pipe(
                catchError(HandleServiceError.handleError('addDashboard', {}))
            );
    }

    getDashboards() {
        return this.http.get<string[]>('dashboard/list')
            .pipe(
                catchError(HandleServiceError.handleError('getDashboards', ['Default']))
            );
    }
}
