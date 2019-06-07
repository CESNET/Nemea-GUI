import { Component, OnInit } from '@angular/core';
import { AlertSimple } from './shared/alert-simple';
import { AlertType } from './shared/alertType';
import { AlertsService } from './services/alerts.service';
import { AlertStateService } from './services/alertState.service';

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
        console.log(selectedAlerts);
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
