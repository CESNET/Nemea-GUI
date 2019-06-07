import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { AlertSimple } from '../shared/alert-simple';
import { AlertTypeToString } from '../shared/alertType';

@Component({
    selector: 'alert-table',
    templateUrl: './alert-table.component.html',
    styleUrls: ['./alert-table.component.scss']
})
export class AlertTableComponent implements OnInit {

    private _alertTable: AlertSimple[] = [];

    checkAll: boolean = false;

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

    createTargetString = AlertTableComponent.createTargetString;
    alertTypeToString = AlertTypeToString;

    selectedItems: string[] = [];

    constructor() { }

    ngOnInit() {
        console.log("GOT ALERT TABLE DATA:");
        console.log(this.alertTable); //TODO: Remove this after debugging
    }

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
    
    toggleAll(newState: boolean) {
        this.selectedItems = [];

        if(!newState) {
            for(let alert of this._alertTable) {
                this.selectedItems.push(alert.id);
            }
            this.selectedItemsChanged.emit(this.selectedItems);
        }
        else {
            this.selectedItemsChanged.emit([]);
        }
    }



}
