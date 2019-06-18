import { Component, OnInit } from '@angular/core';
import { AlertSimple } from './shared/alert-simple';
import { AlertType } from './shared/alert-type';
import { AlertsService } from './services/alerts.service';
import { AlertStateService } from './services/alert-state.service';
import { Filter } from './shared/filter';
import { AlertSet } from './shared/alert-set';

@Component({
    selector: 'alerts',
    templateUrl: './alerts.component.html',
    styleUrls: ['./alerts.component.scss']
})
export class AlertsComponent implements OnInit {

    alertTable: AlertSimple[] = [];
    page: number = 1;
    pageSize: number = 10;
    itemCount: number = 0;
    loading: boolean = false;
    selectedAlerts: string[] = [];
    activeFilter: Filter[] = [];
    statusFilterIdx: number = -1;
    statusSelectValue: string = "all";
    selectedAction: string;
    totalItems: number = 0;

    constructor(
        private alertsService: AlertsService,
        private alertStateService: AlertStateService
    )
    {}

    ngOnInit() {
      this.getAlerts();
    }

    goToPage(n: number): void {
        this.page = n;
        this.getAlerts();
    }

    onNext(): void {
        this.page++;
        this.getAlerts();
    }

    onPrev(): void {
        this.page--;
        this.getAlerts();
    }

    updateSelectedAlertList(selectedAlerts: string[]) {
        this.selectedAlerts = selectedAlerts;
    }

    onPerPageChanged(newValue: number) {
        this.pageSize = newValue;
        if(Math.ceil(this.itemCount / this.pageSize) < this.page) {
            this.page = Math.ceil(this.itemCount / this.pageSize);
        }
        this.getAlerts();
    }

    onStatusChanged(newValue: string) {
        if(this.statusFilterIdx != -1) {
            this.activeFilter.splice(this.statusFilterIdx, 1);
            this.statusFilterIdx = -1;
        }
        this.generateStatusFilter(newValue);
        this.goToPage(1);
        this.getAlerts();
    }

    generateStatusFilter(val: string) {
        if(val && val !== 'all') {
            if(val == "new") {
                let f: Filter = {
                    field: "New",
                    field2: undefined,
                    predicate: "$eq",
                    value: true
                };
                this.activeFilter.push(f);
            }
            else if(val == "undecided") {
                let f: Filter = {
                    field: "Status",
                    field2: undefined,
                    predicate: "$exists",
                    value: 0
                };
                this.activeFilter.push(f);
            }
            else {
                let f: Filter = {
                    field: "Status",
                    field2: undefined,
                    predicate: "$eq",
                    value: +val
                };
                this.activeFilter.push(f);
            }

            this.statusFilterIdx = this.activeFilter.length - 1;
        }
    }

    applyMassOperation() {
        switch(this.selectedAction) {
            case "delete":
                this.deleteSelectedAlerts();
                break;
            case "confirm":
                this.setSelectedAlertType(AlertType.Confirmed);
                break;
            case "false-positive":
                this.setSelectedAlertType(AlertType.FalsePositive);
                break;
        }


    }

    private setSelectedAlertType(type: AlertType) {
        for(let alert of this.selectedAlerts) {
            let idx = this.alertTable.indexOf(this.alertTable.find(i => i.ID === alert));
            if(idx > -1) {
                this.alertTable[idx].Status = type;
            }
        }
        this.alertStateService.setAlertType(type, this.selectedAlerts).subscribe();
    }

    private deleteSelectedAlerts() {
        if(confirm("Are you sure you want to delete " + this.selectedAlerts.length + " alerts? This cannot be undone!")) {
            for(let alert of this.selectedAlerts) {
                this.alertTable = this.alertTable.filter(function( obj ) {
                    return obj.ID !== alert;
                });
            }
            this.alertStateService.deleteAlerts(this.selectedAlerts).subscribe(() => this.getAlerts());
        }
    }

    deleteSingleAlert(id: string) {
        if(confirm("Do you really want to remove this alert ? This cannot be undone!")) {
            this.alertTable = this.alertTable.filter(function( obj ) {
                return obj.ID !== id;
            });
            this.alertStateService.deleteAlerts([id]).subscribe(() => this.getAlerts());
        }
    }

    getAlerts() {
        this.loading = true;
        if(this.activeFilter.length === 0) {
            this.alertsService.getAlertPage(this.page, this.pageSize)
                .subscribe(alerts => this.setAlerts(alerts, false));
        }
        else {
            this.alertsService.getAlertPageFiltered(this.page, this.pageSize, this.activeFilter)
                .subscribe(alerts => this.setAlerts(alerts, true));
        }


    }

    setAlerts(alertSet: AlertSet, filtered: boolean) {
        this.loading = false;
        this.itemCount = alertSet.count;
        this.alertTable = alertSet.data;
        if(this.itemCount !== 0 &&(Math.ceil(this.itemCount / this.pageSize) < this.page)) {
            this.page = Math.ceil(this.itemCount / this.pageSize) || 1;
            this.getAlerts();
        }
        if(!filtered) {
            this.totalItems = alertSet.count;
        }
    }

    setFilter(filter: Filter[]) {
        this.activeFilter = Object.assign([],filter);
        this.generateStatusFilter(this.statusSelectValue);
        this.goToPage(1);
        this.getAlerts();
    }

}
