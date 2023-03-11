import { Routes } from '@angular/router';
import { PathParamsComponent } from './path-params.component';

export const pathParamsRoutes: Routes = [
  {
    path: ':id',
    component: PathParamsComponent,
  },
];
