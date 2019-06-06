import { Component, Input, OnInit } from '@angular/core';
import { AlertSimple } from '../shared/alert-simple';
import { AlertTypeToString } from '../shared/alertType';

@Component({
    selector: 'alert-table',
    templateUrl: './alert-table.component.html',
    styleUrls: ['./alert-table.component.scss']
})
export class AlertTableComponent implements OnInit {

    @Input() alertTable: AlertSimple[];

    createTargetString = AlertTableComponent.createTargetString;
    alertTypeToString = AlertTypeToString;

    constructor() { }

    ngOnInit() {
        console.log(this.alertTable); //TODO: Remove this after debugging
    }

    private static createTargetString(target: string[])
    {
        var len = target.length;
        if(len === 0 || target === []) {
            return "N/A";
        }
        else if(len == 1) {
            return target[0];
        }
        else if(len == 2) {
            return target[0] + ',<br>' + target[1];
        }
        else {
            return target[0] + "... (" + (len - 1) + " more)";
        }
    }

}
