import { Component, EventEmitter, Input, OnInit, Output, OnChanges } from '@angular/core';
import { DashboardItemData } from '../shared/DashboardItemData';
import { AlertDataService } from '../services/alert-data.service';
import { ChartType, ChartOptions, ChartDataSets } from 'chart.js';
import { SingleDataSet, Label } from 'ng2-charts';

@Component({
    selector: 'dashboard-item-content',
    templateUrl: './dashboard-item-content.component.html',
    styleUrls: ['./dashboard-item-content.component.scss']
})
export class DashboardItemContentComponent implements OnInit {

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


    loaded: boolean = false;
    public labels: Label[] = [];
    public data: SingleDataSet = [];
    public legend = true;

    public dataSets: ChartDataSets[] = [{data: []}];
    edit: boolean = false;
    type: ChartType;
    numdata: number = 0;
    prevType: number;
    topAlerts: object;
    dataGot: boolean = false;
    public barChartType: ChartType = 'bar';
    public barChartOptions: ChartOptions = {
        responsive: true,
    };

    chartData: SingleDataSet | ChartDataSets[] | object | number;

    constructor(private alertDataService: AlertDataService) {
    }

    ngOnInit() {
        this._inited = true;
        this.getData();
        this.prevType = this.content.type;
    }

    getData() {
        if (!this.dataGot) {
            this.dataGot = true;
            if (this.content.type == 0) {
                this.alertDataService.getBarChart('Category', this.content.config.timeWindow,
                    this.content.config.aggregation, this.content.config.flowCount === undefined ?
                        false: this.content.config.flowCount)
                    .subscribe(data => {
                        this.dataSets = data['series'];
                        this.labels = data['labels'];
                        this.loaded = true;
                    });
            } else if (this.content.type == 1) {
                this.alertDataService.getPieChart('Category', this.content.config.timeWindow)
                    .subscribe(data => {
                        this.data = data['series'];
                        this.labels = data['labels'];
                        this.loaded = true;
                    });
            } else if (this.content.type == 2) {
                this.alertDataService.getTopAlerts(this.content.gridPosition.rows * 2, this.content.config.timeWindow)
                    .subscribe( data => {
                        this.topAlerts = data;
                        this.loaded = true;
                    });
            } else if (this.content.type == 3) {
                this.alertDataService.getAlertCountByCategory('any', this.content.config.timeWindow)
                    .subscribe(count => {
                        this.numdata = count;
                        this.loaded = true;
                    });
            }
        }

    }


    typeToChartType(chartType: number): ChartType {
        if (this.prevType != chartType) {
            this.getData();
        }
        this.prevType = chartType;
        switch (chartType) {
            case 0:
                return 'bar';
            case 1:
                return 'pie';
            case 5:
                return 'line';
            default:
                return 'line';
        }
    }

    editBoxData() {
        this.editBox.emit(this.content);

    }

    debug() {
        console.log(this.content);
    }


}


