import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class FilterConfigService {
    constructor(
        private http: HttpClient
    )
    {}

    //FIXME proxy config is adding /libapi/
    loadFilterConfig(): Observable<object[]> {
        return this.http.get<object[]>('/../assets/alerts/filters.json');
    }
}
