import {
    Component,
    OnInit,
    Input,
    Output,
    EventEmitter,
    HostListener
} from '@angular/core';
import { FormBuilder } from '@angular/forms'
import { DashboardItemContentType } from '../shared/DashboardItemContentType';
import { DashboardItemData } from '../shared/DashboardItemData';
import { AlertDataService } from '../services/alert-data.service';

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

    @Input() set initData(data: DashboardItemData) {
        if(data) {
            this.newBoxForm.get('title').setValue(data.title);
            if (data.config !== undefined) {
                this.newBoxForm.get('viewType').setValue(data.config['viewType']);
                this.newBoxForm.get('timeWindow').setValue(data.config['timeWindow']);
                this.newBoxForm.get('description').setValue(data.config['description']);
            }
        }

    }

    @Input() show: boolean;
    @Output() settings: EventEmitter<object> = new EventEmitter<object>();
    @Output() editCancelled: EventEmitter<boolean> = new EventEmitter<boolean>();

    newBoxForm;
    categories: string[];

    // TODO: https://medium.com/aubergine-solutions/add-push-and-remove-form-fields-dynamically-to-formarray-with-reactive-forms-in-angular-acf61b4a2afe

    @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
        if (event.key == 'Enter' && this.show) {
            this.saveChanges(this.newBoxForm.value);
        } else if (event.key == 'Escape' && this.show) {
            this.cancelEdit();
        }
    }

    constructor(private formBuilder: FormBuilder,
                private alertDataService: AlertDataService) {
        this.newBoxForm = this.formBuilder.group({
            title: 'New box',
            viewType: -1,
            timeWindow: 24,
            description: ''
        });
    }

    ngOnInit() {
        this.alertDataService.getAlertCategories().subscribe(categories => this.categories = categories)
    }

    saveChanges(options): void {
        this.settings.emit(options);

    }

    cancelEdit(): void {
        this.newBoxForm.reset();
        this.editCancelled.emit(true);
    }

}


