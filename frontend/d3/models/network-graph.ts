import { EventEmmiter } from '@angular/core';
import { Link } from './link';
import { Node } from './node';
import * as d3 from 'd3';

const FORCES = {
    LINKS: 1 / 50,
    COLLISION: 0,
    CHARGE: 0
};

export class NetworkGraph {
    public ticker: EventEmmiter<d3.Simulation<Node, Link>> = new EventEmmiter();
    public simulation: d3.Simulation<any, any>;

    public nodes: Node[] = [];
    public links: Link[] = [];

    constructor(nodes, links, options: {width, height}) {
        this.nodes = nodes;
        this.links = links;

        this.initSimulation(options);
    }

    initNodes() {
        if(!this.simulation) {
            throw new Error('Simulation did not start yet, unable to render nodes.');
        }

        this.simulation.nodes(this.nodes);
    }

    initLinks() {
        if (!this.simulation) {
            throw new Error('Simulation did not start yet, unable to render links.');
        }

        // Initializing the links force simulation
        this.simulation.force('links',
            d3.forceLink(this.links)
                .strength(FORCES.LINKS)
        );
    }

    initSimulation(options) {
        if (!options || !options.width || !options.height) {
            throw new Error('Could not init simulation, missing options.');
        }

        if(!this.simulation) {
            const ticker = this.ticker;

            this.simulation.on('tick', function () {
                ticker.emit(this);
            });

            this.initNodes();
            this.initLinks();
        }

        this.simulation.force("centers", d3.forceCenter(options.width / 2, options.height / 2));

        this.simulation.restart();
    }
}