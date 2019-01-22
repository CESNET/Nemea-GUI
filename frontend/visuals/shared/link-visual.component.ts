import { Component, Input } from '@angular/core';
import { Link } from '../../d3';

@Component({
    selector: '[linkVisual]',
    template: `
    <svg:line
        class="link"
        [attr.x1]="link.source.x + 300"
        [attr.y1]="link.source.y + ((200 / (link.source.outputs + 1)) * (link.sourceOutput + 1))"
        [attr.x2]="link.target.x"
        [attr.y2]="link.target.y + ((200 / (link.target.inputs + 1)) * (link.targetInput + 1))"
        [class.link-error]="!link.target.running"
        [class.link-not-running]="!link.source.running"
    ></svg:line>
  `,
    styleUrls: ['./link-visual.scss']
})
export class LinkVisualComponent  {
    @Input('linkVisual') link: Link;

}