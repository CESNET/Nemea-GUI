import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
    selector: 'dashboard-menu',
    templateUrl: './dashboard-menu.component.html',
    styleUrls: ['./dashboard-menu.component.scss']
})
export class DashboardMenuComponent implements OnInit {

    @Input() dashboardList: string[];

    @Output() displayNewDashboardDialog: EventEmitter<boolean> = new EventEmitter<boolean>();

    activeDashName;

    constructor(private route: ActivatedRoute, private router: Router) { }

    ngOnInit() {
        this.route.params.subscribe(params => {
            if(params.name) {
                this.activeDashName = params.name;
            }
        });
    }

    addDashboard() {
        this.displayNewDashboardDialog.emit(true);
    }

    navigateToDashboard(name: string) {
        this.router.navigate(['dashboard/' + name]);
    }
}
