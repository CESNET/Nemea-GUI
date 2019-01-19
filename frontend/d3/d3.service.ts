import { Injectable } from '@angular/core';
import * as d3 from 'd3';
import { Node, Link, NetworkGraph} from './models';

@Injectable()
export class D3Service {
    constructor() {}

    applyZoomableBehaviour() {}

    applyDraggableBehaviour() {}

    getNetworkGraph(nodes: Node[], links: Link[], options: {width, height}) {
        let graph = new NetworkGraph(nodes, links, options);
        return graph;
    }

}