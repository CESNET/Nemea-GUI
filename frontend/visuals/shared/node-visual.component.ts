import { Component, Input } from '@angular/core';
import { Node } from '../../d3';

@Component({
    selector: '[nodeVisual]',
    template: `
    <svg:g [attr.transform]="'translate(' + node.x + ',' + node.y + ')'">
      <svg:rect
          width="300"
          height="200"
          rx="5"
          ry="5"
          class="node"
      </svg:rect>
      <svg:text class="node-name">
        {{node.name}}
      </svg:text>
    </svg:g>
  `,
    styleUrls: ['./node-visual.scss']
})
export class NodeVisualComponent {
    @Input('nodeVisual') node: Node;
}