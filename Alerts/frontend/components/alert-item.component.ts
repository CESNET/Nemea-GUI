import { Component, OnInit, Input } from '@angular/core';
import { AlertSimple } from '../shared/alert-simple';

@Component({
    selector: 'alert-item',
    templateUrl: './alert-item.component.html',
})
export class AlertItemComponent implements OnInit {

    @Input() alert: AlertSimple;
    target: string;

    constructor() { }

    ngOnInit() {
        this.target = AlertItemComponent.createTargetString(this.alert.target);
    }

    private static createTargetString(target: string[])
    {
        var len = target.length;
        if(len === 0) {
            return "N/A";
        }
        else if(len == 1) {
            return target[0];
        }
        else if(len < 3) {
            var str = "";
            for(let t in target) {
                str = str + ',<br>' + t;
            }
            return str;
        }
        else {
            return target[0] + "... (" + (len - 1) + " more)";
        }
    }

}
