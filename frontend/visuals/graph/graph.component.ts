import { Component, Input } from '@angular/core';
import { D3Service, NetworkGraph, Node } from '../../d3';

@Component({
    providers: [D3Service],
    selector: 'graph',
    template: `
    <svg #svg [attr.width]="_options.width" [attr.height]="_options.height">
      <g [zoomableOf]="svg">
        <g [linkVisual]="link" *ngFor="let link of links"></g>
        <g [nodeVisual]="node" [draggableNode]="node" [draggableInGraph]="graph" *ngFor="let node of nodes"></g>
      </g>
    </svg>
  `,
    styleUrls: ['./graph.component.scss']
})
export class GraphComponent {
    @Input() nodes: Node[];
    @Input() links: any[];

    graph: NetworkGraph;

    constructor(private d3Service: D3Service) { }

    ngOnInit() {
        this.graph = this.d3Service.getNetworkGraph(this.nodes, this.links, this.options);
    }

    ngAfterViewInit() {
        this.graph.initSimulation(this.options);
    }

    private _options: { width, height } = { width: 800, height: 600 };

    // TODO: Fix this to real size of svg window
    get options() {
        return this._options = {
            width: window.innerWidth,
            height: window.innerHeight
        };
    }
}