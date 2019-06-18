import { Component, EventEmitter, HostListener, Input, OnInit, Output, ViewEncapsulation } from '@angular/core'
import { AlertType, AlertTypeToString } from '../shared/alert-type';
import { AlertDetailService } from '../services/alert-detail.service';

@Component({
    selector: 'alert-detail',
    templateUrl: './alert-detail.component.html',
    styleUrls: ['./alert-detail.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AlertDetailComponent implements OnInit {

    constructor(
        private alertDetailService: AlertDetailService
    ) {
    }

    ngOnInit() {
    }

    @Input() alertDetail: object;
    @Output() alertDetailClosed = new EventEmitter<boolean>();
    @Output() setSelectedAlertType = new EventEmitter<AlertType>();
    @Output() removeAlertEvent = new EventEmitter<boolean>();

    @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
        this.closeAlertDetail();
    }

    keys() {

        if (this.alertDetail !== null && this.alertDetail !== undefined) {
            return Object.keys(this.alertDetail);
        }

    }

    closeAlertDetail() {
        this.alertDetailClosed.emit(true);
    }

    setAlertType(type: AlertType) {
        this.editAlertDescription();
        this.alertDetail['Status'] = type;
        this.setSelectedAlertType.emit(type)
    }

    removeAlert() {
        this.removeAlertEvent.emit(true);
    }

    editAlertDescription() {
        let newDesc = prompt('Why was status of this alert changed?', this.alertDetail['StatusComment']);
        if (newDesc != null && newDesc != '') {
            this.alertDetail['StatusComment'] = newDesc;
            this.alertDetailService.editStatusComment(this.alertDetail['ID'], newDesc).subscribe();
        }
    }


    objectToHtml(o: object, offset?: number): string {
        let result = '';
        if (offset === null || offset === undefined) {
            offset = 0;
        }
        if (o instanceof Array) {
            for (let i of o) {
                result += this.handleSingleObjectItem(i, offset, null);
            }
        } else {
            for (let key in o) {
                if (o.hasOwnProperty(key)) {
                    result += this.handleSingleObjectItem(o[key], offset, key);
                } else {
                    console.error(key);
                }

            }
        }
        return result;
    }

    private handleSingleObjectItem(o: object, offset: number, key?: string): string {
        let result = '';
        let label = '';
        if (key !== null) {
            label = '<p class="mb-0 left-' + offset + '"><b>' + AlertDetailComponent.escapeHtmlChars(key) + ':</b> ';
        } else {
            label = '<p class="mb-0 left-' + offset + '"> ';
        }

        if (typeof (o) === 'string' || typeof (o) == 'number') {
            //print as is
            switch (key) {
                case 'Status':
                    result += label + AlertTypeToString(o);
                    break;
                default:
                    // IPv4 pattern
                    let re = new RegExp('^(?:[0-9]{1,3}\\.){3}[0-9]{1,3}$');
                    if (re.test(o)) {
                        result += label + o +
                            '<a href="https://nerd.cesnet.cz/nerd/ip/' + o + '"  target="_blank"><img class="nerd-link" src="/assets/alerts/nerd-icon.png"alt="nerd"></a></p>';
                    } else {
                        result += label + AlertDetailComponent.escapeHtmlChars(o) + '</p>';
                    }
                    break;
            }
        } else {
            result += label + this.objectToHtml(o, offset + 1) + '</p>';
        }

        return result;
    }

    private static escapeHtmlChars(s: string) {
        let entityMap = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': '&quot;',
            "'": '&#39;',
            "/": '&#x2F;'
        };

        return String(s).replace(/[&<>"'\/]/g, st => entityMap[st]);
    }

}
