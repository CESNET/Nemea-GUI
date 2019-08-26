import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Dashboard } from './shared/Dashboard';
import { DashboardsService } from './services/dashboards.service';

@Component({
    selector: 'dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

    activeDash$: string;
    dashboardList: string[] = [];
    addNewDashboardDialogShown: boolean = false;

    constructor(private route: ActivatedRoute,
                private dashboardsService: DashboardsService) {
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            if (params.name) {
                this.activeDash$ = params.name;
            } else {
                this.activeDash$ = 'Default';
            }
        });
        this.dashboardsService.getDashboards()
            .subscribe(result => this.dashboardList = result);
    }

    showNewDashboardDialog() {
        this.addNewDashboardDialogShown = true;
    }

    hideNewDashboardDialog() {
        this.addNewDashboardDialogShown = false;
    }

    dashboardAdded(dashboard: Dashboard) {
        if (this.dashboardList.indexOf(dashboard.name) <= -1) {
            this.dashboardList.push(dashboard.name);
            this.dashboardsService.addDashboard(dashboard.name).subscribe();
            this.hideNewDashboardDialog();
        } else {
            console.error('Dashboard name already exists'); // Todo: Notify user
        }

    }

}
