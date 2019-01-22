import { Injectable } from '@angular/core';
import * as d3 from 'd3';
import { Node, Link, NetworkGraph} from './models';

@Injectable()
export class D3Service {
    constructor() {}

    applyZoomableBehaviour(svgElement, containerElement) {
        let svg, container, zoomed, zoom;

        svg = d3.select(svgElement);
        container = d3.select(containerElement);

        zoomed = () => {
            const transform = d3.event.transform;
            container.attr("transform", "translate(" + transform.x + "," + transform.y + ") scale(" + transform.k + ")");
        };

        zoom = d3.zoom().on("zoom", zoomed);
        svg.call(zoom);
    }

    applyDraggableBehaviour(element, node: Node, graph: NetworkGraph) {
        const d3element = d3.select(element);

        function started() {
            /** Preventing propagation of dragstart to parent elements */
            d3.event.sourceEvent.stopPropagation();

            if (!d3.event.active) {
                graph.simulation.alphaTarget(0.3).restart();
            }

            d3.event.on('drag', dragged).on('end', ended);

            function dragged() {
                node.fx = d3.event.x - 150;
                node.fy = d3.event.y - 100;
            }

            function ended() {
                if (!d3.event.active) {
                    graph.simulation.alphaTarget(0);
                }

                node.fx = null;
                node.fy = null;
            }
        }

        d3element.call(d3.drag()
            .on('start', started));
    }


    getNetworkGraph(nodes: Node[], links: Link[], options: {width, height}) {
        let graph = new NetworkGraph(nodes, links, options);
        return graph;
    }

}