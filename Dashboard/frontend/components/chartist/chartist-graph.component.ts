import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IBarChartOptions, IChartistAnimationOptions, IChartistData } from 'chartist';
import { ChartEvent, ChartType } from 'ng-chartist';

@Component({
    selector: 'chartist-graph',
    templateUrl: './chartist-graph.component.html',
    styleUrls: ['./chartist-graph.component.scss']
})
export class ChartistGraphComponent implements OnInit {


    get type(): ChartType{
        return this._type;
    }
    @Input() set type(value: ChartType) {
        this._type = value;
    }
    private _type: ChartType;

    @Input() data: IChartistData;

    constructor() {}

    ngOnInit() {
        //this.initGraphs();
    }


    initGraphs() {
    }

}
