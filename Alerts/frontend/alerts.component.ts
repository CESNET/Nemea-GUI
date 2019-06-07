import { Component, OnInit } from '@angular/core';
import { AlertSimple } from './shared/alert-simple';
import { AlertType } from './shared/alertType';
import { AlertsService } from './services/alerts.service';

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
        private alertsService: AlertsService
    )
    {}

    ngOnInit() {
      //this.prepareTmpData();
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
        console.log(newValue);
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

    private prepareTmpData() {
        var tmp: AlertSimple = {
            date: '2017-07-09T19:20:06Z',
            flows: 122,
            id: '40c7901e-a516-4735-b614-7abe1ba946a6',
            source: '6.1.2.7',
            status: AlertType.New,
            target: ['84.22.53.170'],
            category: ['Attempt.Login']
        };
        var tmp4: AlertSimple = {
            date: '2017-07-09T19:20:06Z',
            flows: 122,
            id: '43c7901e-a516-4735-b614-7abe1ba946a6',
            source: '6.1.2.7',
            status: AlertType.Undecided,
            target: ['84.22.53.170'],
            category: ['Attempt.Login']
        };
        var tmp2: AlertSimple = {
            date: '2017-07-09T19:20:06Z',
            flows: 122,
            id: '42c7901e-a516-4735-b614-7abe1ba946a6',
            source: '6.1.2.7',
            status: AlertType.Confirmed,
            target: ['84.22.53.170', '84.22.53.57', '84.53.53.170', '84.22.53.18'],
            category: ['Attempt.Login']
        };
        var tmp3: AlertSimple = {
            date: '2017-07-09T19:20:06Z',
            flows: 122,
            id: '41c7901e-a516-4735-b614-7abe1ba946a6',
            source: '126.10.25.75',
            status: AlertType.FalsePositive,
            target: ['84.22.53.170', '84.22.53.57'],
            category: ['Attempt.Login']
        };
        this.alertTable.push(tmp);
        this.alertTable.push(tmp4);
        this.alertTable.push(tmp2);
        this.alertTable.push(tmp3);
    }

}
