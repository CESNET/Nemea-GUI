import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Node, Link, D3Service} from './d3';
import { GraphComponent } from './visuals/graph/graph.component';

@Component({
    selector: 'app-nemea',
    templateUrl: './nemea.component.html',
    styleUrls: ['./nemea.component.scss']
})
export class NemeaComponent implements OnInit {

    nodes: Node[] = [];
    links: Link[] = [];


    constructor() {}

    ngOnInit() {
        this.nodes.push(new Node("test", "module0", "/path/to/exec", 0, 2));
        this.nodes.push(new Node("test", "module1", "/path/to/exec", 2, 1));
        this.nodes.push(new Node("test", "module2", "/path/to/exec", 1, 1));
        this.nodes.push(new Node("test", "module3", "/path/to/exec", 1, 1));
        this.nodes.push(new Node("test", "module4", "/path/to/exec", 1, 1));
        this.nodes.push(new Node("test", "module5", "/path/to/exec", 1, 1));
        this.nodes.push(new Node("test", "module6", "/path/to/exec", 1, 1));
        this.nodes.push(new Node("test", "module7", "/path/to/exec", 1, 1));
        this.nodes.push(new Node("test", "module8", "/path/to/exec", 0, 1));

        this.links.push(new Link(this.nodes[0], this.nodes[1], 0, 1));
        this.links.push(new Link(this.nodes[0], this.nodes[2], 1, 0));
        this.links.push(new Link(this.nodes[0], this.nodes[3], 0, 0));
        this.links.push(new Link(this.nodes[1], this.nodes[4], 0, 0));
        this.links.push(new Link(this.nodes[0], this.nodes[5], 0, 0));
        this.links.push(new Link(this.nodes[2], this.nodes[6], 0, 0));
        this.links.push(new Link(this.nodes[0], this.nodes[7], 0, 0));
        this.links.push(new Link(this.nodes[8], this.nodes[1], 0, 0));

        this.nodes[0].x = 0;this.nodes[0].y = 500;

        this.nodes[1].x = 1000;this.nodes[1].y = 0;
        this.nodes[2].x = 1000;this.nodes[2].y = 1200;
        this.nodes[3].x = 1000;this.nodes[3].y = 300;
        this.nodes[5].x = 1000;this.nodes[5].y = 600;
        this.nodes[7].x = 1000;this.nodes[7].y = 900;

        this.nodes[4].x = 2000;this.nodes[4].y = 0;
        this.nodes[6].x = 2000;this.nodes[6].y = 1200;

        this.nodes[5].running = false;
        this.nodes[2].running = false;

        this.nodes[8].x = 0;this.nodes[8].y = 0;
    }
}