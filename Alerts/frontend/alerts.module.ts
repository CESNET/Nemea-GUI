import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule} from '@angular/router';
import { FormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AuthGuard } from 'app/utils/auth.guard';
import { SafePipe, SafePipeModule } from 'app/utils/safe.pipe';
import { HttpClientModule } from '@angular/common/http';

import { AlertsComponent } from './alerts.component';
import { AlertTableComponent } from './components/alert-table.component';
import { PaginationComponent } from './components/pagination.component';
import { AlertDetailComponent } from './components/alert-detail.component';
import { FilterComponent } from './components/filter.component';
import { FilterCreateComponent } from './components/filter-create.component';
import { FilterRuleComponent } from './components/filter-rule.component';


const routes: Routes = [{
    path: 'alerts',
    component: AlertsComponent,
    canActivate: [AuthGuard],
    data: {
        role: 10,
        name: 'Alerts',
        description: 'Nemea alerts',
        icon: 'fa-exclamation-triangle',
    },
    children: []
}];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        SafePipeModule,
        RouterModule.forChild(routes),
        NgbModule,
        HttpClientModule
    ],
    declarations: [
        AlertsComponent,
        AlertTableComponent,
        PaginationComponent,
        AlertDetailComponent,
        FilterComponent,
        FilterCreateComponent,
        FilterRuleComponent
    ],
    providers: [
        SafePipe
    ]
})
export class AlertsModule {}
