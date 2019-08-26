import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule} from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { GridsterModule } from 'angular-gridster2';
import { ChartistModule } from 'ng-chartist';

import { AuthGuard } from 'app/utils/auth.guard';
import { SafePipe, SafePipeModule } from 'app/utils/safe.pipe';
import { DashboardComponent } from './dashboard.component';
import { DashboardMenuComponent } from './components/dashboard-menu.component';
import { DashboardGridComponent } from './components/dashboard-grid.component';
import { DashboardNewPopupComponent } from './components/dashboard-new-popup.component';
import { DashboardItemContentComponent } from './components/dashboard-item-content.component';
import { DashboardItemEditComponent } from './components/dashboard-item-edit.component';
import { ChartistGraphComponent } from './components/chartist/chartist-graph.component';

const routes: Routes = [
    {
        path: 'dashboard/:name',
        component: DashboardComponent,
        canActivate: [AuthGuard],
        data: {
            role: 10
        }
    },
    {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    data: {
        role: 10,
        name: 'Nemea Dashboard',
        description: 'Alert database in charts',
        icon: 'fa-pie-chart',
    },
    children: []
    },
    ];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SafePipeModule,
        RouterModule.forChild(routes),
        NgbModule,
        GridsterModule,
        HttpClientModule,
        ChartistModule
    ],
    declarations: [
	    DashboardComponent,
        DashboardMenuComponent,
        DashboardGridComponent,
        DashboardNewPopupComponent,
        DashboardItemContentComponent,
        DashboardItemEditComponent,
        ChartistGraphComponent
    ],
    providers: [
        SafePipe
    ]
})
export class DashboardModule {}
