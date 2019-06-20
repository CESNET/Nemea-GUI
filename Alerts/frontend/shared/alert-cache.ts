import { EventEmitter } from '@angular/core'
import { Subject } from 'rxjs';

import { AlertSimple } from './alert-simple';

import { AlertsService } from '../services/alerts.service';
import { AlertSet } from './alert-set';
import { Filter } from './filter';

export class AlertCache {

    // Max cache size will be these 3 numbers added

    /* Number of alerts to load on refresh */
    static ITEMS_TO_LOAD: number = 1000;

    /* Load more to cache when this amount of alerts is in front of user's current page.
     * Should be higher if server has long response times
     */
    static LOAD_MORE_AT_REMAINING: number = 100;

    /* Keep this amount of alerts when clearing old cache in case user wants to go back */
    static CACHE_PREV_ITEMS: number = 100;

    cache: AlertSimple[] = [];
    cachePage: number = 1; // Page containing ITEMS_TO_LOAD items. Used for backend queries.
    cacheStartsAt: number = 0; // Index of item in database
    loading: boolean = false;
    noCacheLoading: boolean = false;
    prevPage: number = 1;
    activeAlertSet: AlertSet = {count: 0, data: []};
    currentAlertSet$: Subject<AlertSet>;


    constructor(
        private alertsService: AlertsService
    ) {
        this.currentAlertSet$ = new Subject<AlertSet>();
    }


    sendNewAlertSet() {
        this.currentAlertSet$.next(this.activeAlertSet);
    }

    initCache(pageSize: number): void {
        this.loading = true;
        this.noCacheLoading = true;
        this.cache = [];
        this.moveCacheWindow(1, pageSize, []);
    }

    // For no filter use empty array
    getPageFromCache(pageNumber: number, pageSize: number, filter: Filter[]) {
        if (this.areDataInCache(pageNumber, pageSize)) {
            if(this.cache.length >= AlertCache.ITEMS_TO_LOAD &&
                !this.loading &&
                this.prevPage < pageNumber &&
                ((pageNumber * pageSize) >= this.cacheStartsAt + this.cache.length - AlertCache.LOAD_MORE_AT_REMAINING)) {
                this.loadNextCachePage(filter);
            }

            let idx: number = ((pageNumber - 1) * pageSize) - this.cacheStartsAt;
            this.activeAlertSet.data = this.cache.slice(idx, idx + +pageSize);
            this.sendNewAlertSet();

        }
        else if(!this.loading){
            this.noCacheLoading = true;
            this.moveCacheWindow(pageNumber, pageSize, filter);
        }
        else {
            // Data are loading, user ran out of cache
            this.noCacheLoading = true;
        }
        this.prevPage = pageNumber;
    }

    private loadNextCachePage(filter: Filter[]) {
        this.loading = true;
        this.cachePage++;
        if(filter.length === 0) {
            this.alertsService.getAlertPage(this.cachePage, AlertCache.ITEMS_TO_LOAD).subscribe(
                alerts => {
                    this.alertLoadCallback(alerts);
                    this.clearCacheStart(Math.min(alerts.data.length, AlertCache.ITEMS_TO_LOAD));
                });
        }
        else {
            this.alertsService.getAlertPageFiltered(this.cachePage, AlertCache.ITEMS_TO_LOAD, filter).subscribe(
                alerts => {
                    this.alertLoadCallback(alerts);
                    this.clearCacheStart(Math.min(alerts.data.length, AlertCache.ITEMS_TO_LOAD));
                });
        }
    }

    private alertLoadCallback(alerts: AlertSet) {
        this.cache = this.cache.concat(alerts.data);
        this.loading = false;
        this.noCacheLoading = false;
    }

    private clearCacheStart(numberOfNewItems: number) {
        if(this.cache.length > (AlertCache.ITEMS_TO_LOAD * 2)) {
            this.cache = this.cache.slice(numberOfNewItems, this.cache.length);
            this.cacheStartsAt += numberOfNewItems;
        }
        else if(this.cache.length == (AlertCache.ITEMS_TO_LOAD * 2)){
            this.cache = this.cache.slice(Math.max(numberOfNewItems - (AlertCache.LOAD_MORE_AT_REMAINING + AlertCache.CACHE_PREV_ITEMS), 0),
                this.cache.length);

            this.cacheStartsAt += Math.max(numberOfNewItems - (AlertCache.LOAD_MORE_AT_REMAINING + AlertCache.CACHE_PREV_ITEMS), 0);
        }
    }

    forceReloadCache(pageNumber: number, pageSize: number, filter: Filter[]) {
        this.noCacheLoading = true;
        this.moveCacheWindow(pageNumber, pageSize, filter);
    }

    private moveCacheWindow(pageNumber: number, pageSize: number, filter: Filter[]) {
        this.loading = true;
        this.noCacheLoading = true;
        this.cachePage = AlertCache.globalPageToDbPage(pageNumber, pageSize);
        if(filter.length === 0) {
            this.alertsService.getAlertPage(this.cachePage, AlertCache.ITEMS_TO_LOAD).subscribe(
                alerts => {
                    this.cacheStartsAt = (this.cachePage - 1) * AlertCache.ITEMS_TO_LOAD;
                    this.cache = [];
                    this.alertLoadCallback(alerts);
                    this.activeAlertSet.count = alerts.count;

                    this.getPageFromCache(pageNumber, pageSize, filter);

                });
        }
        else {
            this.alertsService.getAlertPageFiltered(this.cachePage, AlertCache.ITEMS_TO_LOAD, filter).subscribe(
                alerts => {
                    this.cacheStartsAt = (this.cachePage - 1) * AlertCache.ITEMS_TO_LOAD;
                    this.cache = [];
                    this.alertLoadCallback(alerts);
                    this.activeAlertSet.count = alerts.count;

                    this.getPageFromCache(pageNumber, pageSize, filter);

                });
        }


    }

    private static globalPageToDbPage(pageNumber: number, pageSize: number) {
        return Math.max(Math.ceil((pageNumber * pageSize) / AlertCache.ITEMS_TO_LOAD), 1);
    }

    private areDataInCache(pageNumber: number, pageSize: number): boolean {
        let result = (((pageNumber - 1) * pageSize) >= this.cacheStartsAt) &&
            (((pageNumber * pageSize) <= (this.cacheStartsAt + this.cache.length)) || ((pageNumber * pageSize) > this.activeAlertSet.count));
        return result;
    }

}
