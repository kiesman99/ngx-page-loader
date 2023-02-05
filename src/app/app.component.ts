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
      <li><a [routerLink]="['angular', 'profile', '123']">Angular</a></li>
      <li><a [routerLink]="['angular-inline', 'profile', '123']">Angular Inline</a></li>
      <li><a [routerLink]="['page-resolver', 'profile', '123']">Page Resolver</a></li>
      <li><a [routerLink]="['page-resolver-with-params', 'profile', '123']">Page Resolver with params</a></li>
      <li><a [routerLink]="['page-resolver-long-loading', 'profile', '123']">Page Resolver long loading</a></li>
      <li><a [routerLink]="['page-resolver-reload', 'posts', '123']">Page Resolver reload</a></li>
      <!-- <li><a [routerLink]="['page-resolver-nested', 'parent']">Page Resolver Nested - Parent</a></li>
      <li><a [routerLink]="['page-resolver-nested', 'parent', 'child']">Page Resolver Nested - Child</a></li> -->
    </ul>
    <router-outlet></router-outlet>
  `
})
export class AppComponent {}
