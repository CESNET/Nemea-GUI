import { Component, Input } from '@angular/core';
import { Node } from '../../d3';

@Component({
    selector: '[nodeVisual]',
    template: `
    <svg:g>
      <svg:rect [attr.transform]="'translate(' + node.x + ',' + node.y + ')'"
          width="300"
          height="200"
          rx="5"
          ry="5"
          class="node"
          [class.node-stopped]="!node.running">
      </svg:rect>
      <svg:text class="node-text node-name" [attr.x]="node.x + 150" [attr.y]="node.y + 40">
        {{node.name}}
      </svg:text>
      <svg:text class="node-text node-path" [attr.x]="node.x + 150" [attr.y]="node.y + 80">
        {{node.path}}
      </svg:text>
    </svg:g>
  `,
    styleUrls: ['./node-visual.scss']
})
export class NodeVisualComponent {
    @Input('nodeVisual') node: Node;

}