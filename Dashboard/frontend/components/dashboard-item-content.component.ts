import { Component, EventEmitter, Input, OnInit, Output, OnChanges } from '@angular/core';
import { DashboardItemContentType } from '../shared/DashboardItemContentType';
import { DashboardItemData } from '../shared/DashboardItemData';
import { IBarChartOptions, IChartistAnimationOptions, IChartistData } from 'chartist';
import { ChartEvent, ChartType } from 'ng-chartist';
import { AlertDataService } from '../services/alert-data.service';

@Component({
    selector: 'dashboard-item-content',
    templateUrl: './dashboard-item-content.component.html',
    styleUrls: ['./dashboard-item-content.component.scss']
})
export class DashboardItemContentComponent implements OnInit{

    private _inited: boolean = false;
    private _content: DashboardItemData;
    get content(): DashboardItemData {
        return this._content
    };
    @Input() set content(data: DashboardItemData) {
        this._content = data;
        this._content.type = +data.config['viewType'];
    };
    @Input() loading: boolean;

    @Output() editBox: EventEmitter<DashboardItemData> = new EventEmitter<DashboardItemData>();


    edit: boolean = false;
    type: ChartType;
    options: IBarChartOptions;
    data: IChartistData;
    numdata: number = 25;
    prevType: number;

    constructor(private alertDataService: AlertDataService) {
    }

    ngOnInit() {
        this._inited = true;
        this.getData();
        this.prevType = this.content.type;
    }

    getData() {
        console.log("Getting data");
        if(this.content.type == 0) {
            this.data = {
                series: [[10,11,12,5], [8,9,13,6]]
            };
            this.alertDataService.getBarChart("Category", 5000, 10000)
                .subscribe(data => this.data = data)// FIXME: Read from config
        }
        else if(this.content.type == 1) {
            this.alertDataService.getPieChart("Category", 5000)
                .subscribe(data => this.data = data)
        }
        else if(this.content.type == 3) {
            this.alertDataService.getAlertCountByCategory("any", 15000)
                .subscribe(count => {
                    console.log(count);
                    this.numdata = count});
        }
    }


    typeToChartType(chartType: number): ChartType {
        if(this.prevType != chartType) {
            this.getData();
        }
        this.prevType = chartType;
        switch(chartType) {
            case 0:
                return 'Bar';
            case 1:
                return 'Pie';
            case 5:
                return 'Line';
            default:
                return 'Line';
        }
    }

    editBoxData() {
        this.editBox.emit(this.content);
    }

    debug() {
        console.log(this.content);
    }

}


