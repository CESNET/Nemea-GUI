import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { AlertSimple } from '../shared/alert-simple';
import { AlertType, AlertTypeToString } from '../shared/alert-type';
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
    detailLoading: string = "";

    get alertTable(): AlertSimple[] {
        return this._alertTable;
    }

    @Input()
    set alertTable(value: AlertSimple []) {
        this.checkAll = false;
        this.toggleAll(true);
        this._alertTable = value;
    }

    @Input() loading: boolean;

    @Output() selectedItemsChanged = new EventEmitter<string[]>();
    @Output() removeAlertEvent = new EventEmitter<string>();

    createIpListHtml = AlertTableComponent.createIpListHtml;
    alertTypeToString = AlertTypeToString;

    selectedItems: string[] = [];



    private static createIpListHtml(ipList: string[])
    {
        if(!ipList) {
            return "N/A";
        }
        let len = ipList.length;
        if(len === 0 || ipList === []) {
            return "N/A";
        }
        else if(len == 1) {
            return ipList[0] + '<a href="https://nerd.cesnet.cz/nerd/ip/' + ipList[0] + '"  target="_blank">\n' +
                '                <img class="nerd-link"\n' +
                '                     src="/assets/alerts/nerd-icon.png"\n' +
                '                     alt="nerd">\n' +
                '            </a>';
        }
        else if(len == 2) {
            return ipList[0] + ',<br>' + ipList[1];
        }
        else {
            return ipList[0] + "... (" + (len - 1) + " more)";
        }
    }

    toggleCheckedId(clickEvent: any) {
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
        this.removeNewStatus(id);
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
        this.removeNewStatus(alertId);
        this.detailLoading = alertId;
        this.alertDetailService.getAlertDetail(alertId).subscribe(alertDetail => {
            this.alertDetail = alertDetail;
            this.detailLoading = "";
        });
    }

    removeNewStatus(alertId: string) {
        let idx = this._alertTable.indexOf(this._alertTable.find(i => i.ID === alertId));
        this._alertTable[idx].New = false;
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
