import { AlertsComponent } from '../alerts.component';
import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';

@Injectable()
export class CanDeactivateGuard implements CanDeactivate<AlertsComponent> {
    canDeactivate(component: AlertsComponent): boolean {
        if(component.isLoading()){
            return confirm("Some changes have not been saved yet! If you leave now, changes may be lost!");
        }
        return true;
    }
}
