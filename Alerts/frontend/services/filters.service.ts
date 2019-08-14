import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {HttpParams} from "@angular/common/http";

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Filter } from '../shared/filter';
import { SavedFilter } from '../shared/saved-filter';
import { HandleServiceError } from '../shared/handle-service-error';

@Injectable({
    providedIn: 'root',
})
export class FiltersService {
    constructor(
        private http: HttpClient
    )
    {}


    loadSavedFilterNames(): Observable<string[]> {
        return this.http.get<string[]>('/alerts/filter-names')
            .pipe(
                catchError(HandleServiceError.handleError('loadSavedFilterNames', []))
            );
    }

    loadSavedFilter(filterName: string): Observable<SavedFilter> {
        return this.http.post<SavedFilter>('/alerts/load-filter', {'name': filterName});

    }

    saveFilter(filter: Filter[], name: string): any {
        return this.http.post<object>('/alerts/save-filter', {'name': name, 'filter': filter})
            .pipe(
                catchError(HandleServiceError.handleError('saveFilter', {'success': false}))
            );
    }

    removeSavedFilter(name: string): Observable<object> {
        return this.http.post<object>('/alerts/delete-filter', {'name': name})
            .pipe(
                catchError(HandleServiceError.handleError('removeSavedFilter', {'success': false}))
            );
    }
}
