import { Component, OnInit, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { Dashboard } from '../shared/Dashboard';

@Component({
    selector: 'dashboard-new-popup',
    templateUrl: './dashboard-new-popup.component.html',
    styleUrls: ['./dashboard-new-popup.component.scss']
})
export class DashboardNewPopupComponent implements OnInit {

    private model: Dashboard = new Dashboard();

    @Input() show: boolean;

    @Output() dataSet: EventEmitter<Dashboard> = new EventEmitter<Dashboard>();
    @Output() canceled: EventEmitter<boolean> = new EventEmitter<boolean>();

    @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
        this.cancel();
    }

    constructor() { }

    ngOnInit() {}

    saveData() {
        if(this.model.name && this.model.name !== "") {
            this.dataSet.emit(this.model);
            this.model.name = ""; // Remove name to prepare for adding next dashboard
        }

    }

    cancel() {
        this.canceled.emit(true);
    }

}


