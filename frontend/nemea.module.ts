import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule} from '@angular/router';
import { FormsModule } from '@angular/forms';

import { NemeaComponent } from "./nemea.component";

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AuthGuard } from 'app/utils/auth.guard';
import { SafePipe, SafePipeModule } from 'app/utils/safe.pipe';
import { HttpClientModule } from '@angular/common/http';
import { GraphComponent } from './visuals/graph/graph.component';
import { LinkVisualComponent } from './visuals/shared/link-visual.component';
import { NodeVisualComponent } from './visuals/shared/node-visual.component';
import { D3Service, ZoomableDirective } from './d3';
import { DraggableDirective } from './d3/directives/draggable.directive';

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
        NemeaComponent,
        GraphComponent,
        LinkVisualComponent,
        NodeVisualComponent,
        ZoomableDirective,
        DraggableDirective
    ],
    providers: [
        SafePipe,
        D3Service
    ]
})
export class NemeaModule {}
