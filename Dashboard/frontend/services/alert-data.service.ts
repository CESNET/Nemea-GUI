import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http'
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HandleServiceError } from '../shared/handle-service-error';

@Injectable({
    providedIn: 'root'
})
export class AlertDataService {
    constructor(private http: HttpClient) {}

    getAlertCategories() {
        return this.http.get<string[]>('/dashboard/alert-categories')
            .pipe(
                catchError(HandleServiceError.handleError('getAlertCategories', []))
            );
    }

    getAlertCountByCategory(category, timeWindow) {
        let params = new HttpParams()
            .set('category', category)
            .set('time_window', timeWindow.toString());
        return this.http.get<number>('/dashboard/alert-count', {'params': params})
            .pipe(
                catchError(HandleServiceError.handleError('getAlertCountByCategory', NaN))
            );
    }

    getTopAlerts(count, timeWindow) {
        let params = new HttpParams()
            .set('count', count.toString())
            .set('time_window', timeWindow.toString());
        return this.http.get<object[]>('/dashboard/top-alerts', {'params': params})
            .pipe(
                catchError(HandleServiceError.handleError('getTopAlerts', []))
            );
    }

    getPieChart(category, timeWindow) {
        let params = new HttpParams()
            .set('category', category)
            .set('time_window', timeWindow.toString());
        return this.http.get<object>('/dashboard/pie-chart', {'params': params})
            .pipe(
                catchError(HandleServiceError.handleError('getPieChart', {'labels': [], 'series': []}))
            );
    }

    getBarChart(category, timeWindow, aggregation, flowCount) {
        let params = new HttpParams()
            .set('category', category)
            .set('time_window', timeWindow.toString())
            .set('aggregation', aggregation.toString())
            .set('flowCount', flowCount);
        return this.http.get<object>('dashboard/bar-chart', {'params': params})
            .pipe(
                catchError(HandleServiceError.handleError('getBarChart', {'labels': [], 'series': []}))
            );
    }
}
