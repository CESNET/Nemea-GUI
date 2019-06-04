import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule} from '@angular/router';
import { FormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AuthGuard } from 'app/utils/auth.guard';
import { SafePipe, SafePipeModule } from 'app/utils/safe.pipe';
import { AlertsComponent } from './alerts.component';


const routes: Routes = [{
    path: 'alerts',
    component: AlertsComponent,
    canActivate: [AuthGuard],
    data: {
        role: 10,
        name: 'Alerts',
        description: 'Nemea alerts (TODO: better description)',
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
    ],
    declarations: [
        AlertsComponent
    ],
    providers: [
        SafePipe
    ]
})
export class AlertsModule {}
