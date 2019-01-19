import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule} from '@angular/router';
import { FormsModule } from '@angular/forms';

import { NemeaComponent } from "./nemea.component";

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AuthGuard } from 'app/utils/auth.guard';
import { SafePipe, SafePipeModule } from 'app/utils/safe.pipe';
import { HttpClientModule } from '@angular/common/http';

const routes: Routes = [{
    path: 'nemea',
    component: NemeaComponent,
    canActivate: [AuthGuard],
    data: {
        role: 10,
        name: 'Nemea',
        description: 'Nemea framework management toolkit',
        icon: 'fa-cubes',
    },
    children: []
}];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        SafePipeModule,
        HttpClientModule,
        RouterModule.forChild(routes),
        NgbModule.forRoot(),
    ],
    declarations: [
        NemeaComponent
    ],
    providers: [
        SafePipe
    ]
})
export class NemeaModule {}
