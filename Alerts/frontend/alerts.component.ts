import { Component, OnInit } from '@angular/core';
import { AlertSimple } from './shared/alert-simple';
import { AlertType } from './shared/alertType';
import { AlertsService } from './services/alerts.service';
import { AlertStateService } from './services/alert-state.service';

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

    selectedAction: string;

    constructor(
        private alertsService: AlertsService,
        private alertStateService: AlertStateService
    )
    {}

    ngOnInit() {
      this.fetchAlertCount();
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
        //TODO: Filtering
        console.log(newValue);
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
            this.alertStateService.deleteAlerts(this.selectedAlerts).subscribe(() => this.fixAfterDeleteOffset());
        }
    }

    deleteSingleAlert(id: string) {
        if(confirm("Do you really want to remove alert " + id + "? This cannot be undone!")) {
            this.alertTable = this.alertTable.filter(function( obj ) {
                return obj.ID !== id;
            });
            this.alertStateService.deleteAlerts([id]).subscribe(() => this.fixAfterDeleteOffset());
        }
    }

    private fixAfterDeleteOffset(): void {
        this.alertsService.getAlertCount()
            .subscribe(alertCount => {
                this.itemCount = alertCount;
                if(Math.ceil(this.itemCount / this.pageSize) < this.page) {
                    this.page = Math.ceil(this.itemCount / this.pageSize);
                }
                this.getAlerts();
            });
    }

    getAlerts() {
        this.loading = true;
        this.alertsService.getAlertPage(this.page, this.pageSize)
            .subscribe(alerts => this.setAlerts(alerts));
    }

    setAlerts(alerts: AlertSimple[]) {
        this.loading = false;
        this.alertTable = alerts;
    }

    fetchAlertCount(): void {
        this.alertsService.getAlertCount()
            .subscribe(alertCount => this.itemCount = alertCount);
    }
    
}
