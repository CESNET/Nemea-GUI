import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DashboardItemData } from '../shared/DashboardItemData';
import { AlertDataService } from '../services/alert-data.service';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label } from 'ng2-charts';
import { DashboardItemConfig } from '../shared/DashboardItemConfig';
import { DashboardItemContentType } from '../shared/DashboardItemContentType';
import { DashboardGridService } from '../services/dashboard-grid.service';

@Component({
    selector: 'dashboard-item-content',
    templateUrl: './dashboard-item-content.component.html',
    styleUrls: ['./dashboard-item-content.component.scss']
})
export class DashboardItemContentComponent implements OnInit {
    get rows(): number {
        return this._rows;
    }

    @Input() set rows(value: number) {
        this._rows = value;
        if (this._inited) {
            this.loaded = false;
            this.getData();
        }
    }

    get config(): DashboardItemConfig {
        return this._config;
    }

    @Input() set config(value: DashboardItemConfig) {
        this._config = value;
        if (this._inited) {
            this.loaded = false;
            this.getData();
        }
    }

    private _rows: number;
    private _config: DashboardItemConfig;
    private _inited: boolean = false;


    @Input() content: DashboardItemData;

    @Output() editBox: EventEmitter<DashboardItemData> = new EventEmitter<DashboardItemData>();


    chartData: ChartDataSets[] | object | number = [{data: []}];
    labels: Label[] = [];
    public chartOptions: ChartOptions = {
        responsive: true,
    };
    loaded: boolean = false;

    constructor(private alertDataService: AlertDataService, private gridService: DashboardGridService) {
    }

    ngOnInit() {
        this._inited = true;
        this.getData();
        /*this.gridService.layoutChangedEvent.subscribe(id => {
            if(this.content.gridPosition.id == id) {
                this.getData();
            }
        });*/
    }

    getData() {
        this.loaded = false;
        if (this.config.viewType == DashboardItemContentType.Barchart) {
            this.alertDataService.getBarChart(this.config.category, this.config.timeWindow,
                this.config.aggregation, this.config.flowCount === undefined ?
                    false : this.config.flowCount)
                .subscribe(data => {
                    this.chartData = data['series'];
                    this.labels = data['labels'];
                    this.loaded = true;
                });
        } else if (this.config.viewType == DashboardItemContentType.Piechart) {
            this.alertDataService.getPieChart(this.config.category, this.config.timeWindow)
                .subscribe(data => {
                    this.chartData = [{data: data['series']}];
                    this.labels = data['labels'];
                    this.loaded = true;
                });
        } else if (this.config.viewType == DashboardItemContentType.Top) {
            // 200px = row size,
            // (50 px = box header, 50px = table header, 40px = box padding) == 140px
            // 50 px = table row height
            this.alertDataService.getTopAlerts(Math.max(Math.round(((this.rows * 200) - 140) / 50), 2), this.config.timeWindow)
                .subscribe(data => {
                    this.chartData = data;
                    this.loaded = true;
                });
        } else if (this.config.viewType == DashboardItemContentType.Sum) {
            this.alertDataService.getAlertCountByCategory(this.config.category, this.config.timeWindow)
                .subscribe(count => {
                    this.chartData = count;
                    this.loaded = true;
                });
        }
    }


    typeToChartType(chartType: number): ChartType {
        switch (+chartType) {
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


    checkNoData(): boolean {
        if(this.config.viewType == 0 || this.config.viewType == 1) {
            return this.chartData[0]['data'].length == 0;
        }
        else {
            return false;
        }

    }
}


