import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {HttpParams} from "@angular/common/http";

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Filter } from '../shared/filter';
import { SavedFilter } from '../shared/saved-filter';

@Injectable({
    providedIn: 'root',
})
export class FiltersService {
    constructor(
        private http: HttpClient
    )
    {}


    loadSavedFilterNames(): Observable<string[]> {
        return this.http.get<string[]>('/alerts/');
    }

    loadSavedFilter(filterName: string): Observable<SavedFilter> {
        let params = new HttpParams()
            .set('name', filterName);
        return this.http.get<SavedFilter>('/alerts/');
    }

    saveFilter(filter: Filter[], name: string) {
        return this.http.post<object>('/alerts/', {'name': name, 'data': filter});
    }
}
