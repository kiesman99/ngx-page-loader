import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoadingIndicatorComponent } from './shared/loading-indicator.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, LoadingIndicatorComponent],
  template: `
    <app-loading-indicator></app-loading-indicator>
    <ul>
      <li><a [routerLink]="['long-loading']">Long Loading</a></li>
      <li><a [routerLink]="['path-params/3']">Path Params - ID: 3</a></li>
      <li><a [routerLink]="['form']" [queryParams]="{id: 3}">Form - ID: 3</a></li>
      <li><a [routerLink]="['service-resolver']">Service Resolver</a></li>
      <li><a [routerLink]="['form-test']">Form Test</a></li>
    </ul>
    <router-outlet></router-outlet>
  `
})
export class AppComponent {}
