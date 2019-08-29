import { Component, OnInit, Input, HostListener, OnDestroy } from '@angular/core';
import { GridsterConfig, GridsterItem } from 'angular-gridster2';
import { DashboardGridService } from '../services/dashboard-grid.service';
import { DashboardItemData } from '../shared/DashboardItemData';
import { DashboardItemContentComponent } from './dashboard-item-content.component';
import { DashboardItemConfig } from '../shared/DashboardItemConfig';

@Component({
    selector: 'dashboard-grid',
    templateUrl: './dashboard-grid.component.html',
    styleUrls: ['./dashboard-grid.component.scss']
})
export class DashboardGridComponent implements OnInit {
    boxEditShown: boolean = false;
    gridLoading: boolean = false;

    get activeDashboardName(): string {
        return this._dashName;
    }
    @Input() set activeDashboardName(val: string) {
        this.loadDashboardData(val);
        this._dashName = val;
    }
    private _dashName: string;

    @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
        if(event.altKey) {
            if(event.key == 'n' && !this.boxEditShown) {
                this.showAddBoxDialog();
            }
            else if(event.key == 's') {
                this.saveGrid();
            }
        }
    }

    editData: DashboardItemData;
    editing: boolean = false;
    saving: boolean = false;
    saveBtnIcon = '<i class="fa fa-floppy-o"></i>';

    options: GridsterConfig = {
        gridType: "fixed",
        draggable: {
            enabled: true
        },
        pushItems: false,
        resizable: {
            enabled: true
        },
        fixedColWidth: 200,
        fixedRowHeight: 200,
        minItemCols: 1,
        minItemRows: 1,
    };
    layout: DashboardItemData[] = [];


    constructor(private gridService: DashboardGridService) { }

    ngOnInit() {
        this.gridLoading = true;
        this.gridService.loadDashboard(this.activeDashboardName);
        this.gridService.layoutChangedEvent.subscribe(() => {
            this.layout = this.gridService.layout;
            this.gridLoading = false;
        });

    }

    loadDashboardData(name: string) {
        this.gridLoading = true;
        this.gridService.loadDashboard(name);
    }

    showAddBoxDialog() {
        this.editing = false;
        this.editData = {
            config: undefined, gridPosition: undefined, title: "New box"

        };
        this.boxEditShown = true;
    }

    hideAddBoxDialog() {
        this.boxEditShown = false;
    }

    addBox(data: DashboardItemConfig) {
        if(this.editing) {
            this.editData.title = data.title;
            this.editData.config = data;
            this.gridService.editItem(this.editData);
            this.editing = false;
        }
        else {
            this.gridService.addItem(data);
        }
        this.hideAddBoxDialog();
    }

    editBoxWithInit(initData: DashboardItemData) {
        this.editing = true;
        this.editData = initData;
        this.boxEditShown = true;
    }

    cancelEdit() {
        this.editing = false;
        this.editData = {
            config: undefined, gridPosition: undefined, title: "New box"
        };
        this.hideAddBoxDialog();
    }

    saveGrid() {
        if(!this.saving) {
            this.saving = true;
            this.saveBtnIcon = '<i class="fa fa-spinner fa-pulse fa-fw" title="Saving..."></i>';
            this.gridService.save(this.activeDashboardName).subscribe(() => {},
                e => {
                    alert('Could not save!\n' + e.message);
                    this.saving = false;
                    this.saveBtnIcon = '<i class="fa fa-times"></i>';
                    setTimeout(() => {this.saveBtnIcon = '<i class="fa fa-floppy-o" title="Could not save"></i>'}, 3000);
                },
                () => {
                    this.saving = false;
                    this.saveBtnIcon = '<i class="fa fa-check" title="Saved!"></i>';
                    setTimeout(() => this.saveBtnIcon = '<i class="fa fa-floppy-o"></i>', 1000);
                });
        }
    }
}
