import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { AlertSimple } from '../shared/alert-simple';
import { AlertType, AlertTypeToString } from '../shared/alertType';
import { AlertStateService } from '../services/alert-state.service';
import { AlertDetailService } from '../services/alert-detail.service';

@Component({
    selector: 'alert-table',
    templateUrl: './alert-table.component.html',
    styleUrls: ['./alert-table.component.scss']
})
export class AlertTableComponent implements OnInit {

    constructor(
        private alertStateService: AlertStateService,
        private alertDetailService: AlertDetailService
    ) { }

    ngOnInit() {}

    private _alertTable: AlertSimple[] = [];
    checkAll: boolean = false;
    alertDetail: object = null;

    get alertTable(): AlertSimple[] {
        return this._alertTable;
    }

    @Input()
    set alertTable(value: AlertSimple []) {
        this.checkAll = false;
        this.toggleAll(true);
        this._alertTable = value;
    }

    @Output() selectedItemsChanged = new EventEmitter<string[]>();

    @Output() removeAlertEvent = new EventEmitter<string>();

    createTargetString = AlertTableComponent.createTargetString;
    alertTypeToString = AlertTypeToString;

    selectedItems: string[] = [];



    private static createTargetString(target: string[])
    {
        if(!target) {
            return "N/A";
        }
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

    toggleCheckedId(clickEvent: any) {
        console.log(clickEvent.currentTarget.value);
        const index = this.selectedItems.indexOf(clickEvent.currentTarget.value, 0);
        if(clickEvent.currentTarget.checked) {
            // Add to array
            if (index == -1) {
                this.selectedItems.push(clickEvent.currentTarget.value);
            }
        }
        else {
            //remove from array
            if (index > -1) {
                this.selectedItems.splice(index, 1);

            }
        }
        this.selectedItemsChanged.emit(this.selectedItems);
    }

    setSelectedAlertType(type: AlertType) {
        if(this.alertDetail !== null) {
            this.setAlertType(this.alertDetail["ID"], type);
        }

    }

    setAlertType(id: string, status: AlertType) {
        let idx = this._alertTable.indexOf(this._alertTable.find(i => i.ID === id));
        this._alertTable[idx].Status = status;
        this.alertStateService.setAlertType(status, [id]).subscribe();
    }

    toggleAll(newState: boolean) {
        this.selectedItems = [];

        if(!newState) {
            for(let alert of this._alertTable) {
                this.selectedItems.push(alert.ID);
            }
            this.selectedItemsChanged.emit(this.selectedItems);
        }
        else {
            this.selectedItemsChanged.emit([]);
        }
    }

    loadAlertDetail(alertId: string) {
        this.alertDetailService.getAlertDetail(alertId).subscribe(alertDetail => {
            this.alertDetail = alertDetail;
            console.log(this.alertDetail);
        });
    }


    closeAlertDetail() {
        this.alertDetail = null;
    }

    removeSingleAlert() {
        if(this.alertDetail !== null) {
            this.removeAlertEvent.emit(this.alertDetail["ID"]);
            this.alertDetail = null;
        }

    }

}
