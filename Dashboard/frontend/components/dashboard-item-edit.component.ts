import {
    Component,
    OnInit,
    Input,
    Output,
    EventEmitter,
    HostListener
} from '@angular/core';
import { FormBuilder } from '@angular/forms'
import { DashboardItemData } from '../shared/DashboardItemData';
import { AlertDataService } from '../services/alert-data.service';
import { DashboardItemConfig } from '../shared/DashboardItemConfig';

@Component({
    selector: 'dashboard-item-edit',
    templateUrl: './dashboard-item-edit.component.html',
    styleUrls: ['./dashboard-item-edit.component.scss']
})
export class DashboardItemEditComponent implements OnInit {

    private _initData: DashboardItemData;

    get initData(): DashboardItemData {
        return this._initData;
    }

    config: DashboardItemConfig = new DashboardItemConfig();


    @Input() set initData(data: DashboardItemData) {
        if (data) {
            this.config.title = data.title;
            if (data.config !== undefined) {
                this.config.viewType = data.config['viewType'];
                this.config.timeWindow = data.config['timeWindow'];
                this.config.aggregation = data.config['aggregation'];
                this.config.description = data.config['description'];
                this.config.flowCount = data.config['flowCount'];
            }
        }

    }

    @Input() show: boolean;
    @Output() settings: EventEmitter<object> = new EventEmitter<object>();
    @Output() editCancelled: EventEmitter<boolean> = new EventEmitter<boolean>();
    categories: string[];

    @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
        if (event.key == 'Enter' && this.show) {
            this.saveChanges();
        } else if (event.key == 'Escape' && this.show) {
            this.cancelEdit();
        }
    }

    constructor(private formBuilder: FormBuilder,
                private alertDataService: AlertDataService) {
    }

    ngOnInit() {
        this.alertDataService.getAlertCategories().subscribe(categories => this.categories = categories)
    }

    saveChanges(): void {
        let tmp: DashboardItemConfig = {
            aggregation: this.config.aggregation,
            category: this.config.category,
            description: this.config.description,
            flowCount: this.config.flowCount,
            timeWindow: this.config.timeWindow,
            title: this.config.title,
            viewType: this.config.viewType

        };
        this.settings.emit(tmp);
    }

    cancelEdit(): void {
        this.resetConfig();
        this.editCancelled.emit(true);
    }

    resetConfig(): void {
        if (this.initData && this.initData.config) {
            this.config = {
                category: this.initData.config.category ? this.initData.config.category : 'Category',
                aggregation: this.initData.config.aggregation ? this.initData.config.aggregation : 30,
                description: this.initData.config.description ? this.initData.config.description : '',
                timeWindow: this.initData.config.timeWindow ? this.initData.config.timeWindow : 24,
                title: this.initData.config.title ? this.initData.config.title : 'New box',
                viewType: this.initData.config.viewType ? this.initData.config.viewType : -1,
                flowCount: this.initData.config.flowCount ? this.initData.config.flowCount : 'false'
            }
        } else {
            this.config = {
                category: 'Category',
                aggregation: 30,
                description: '',
                flowCount: 'false',
                timeWindow: 30,
                title: 'New box',
                viewType: -1

            }
        }

    }

}


