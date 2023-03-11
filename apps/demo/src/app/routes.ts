import { Routes } from '@angular/router';
import { formTestRoutes } from './form-test/routes';
import { formRoutes } from './form/routes';
import { longLoadingRoutes } from './long-loading/routes';
import { pathParamsRoutes } from './path-params/routes';
import { serviceResolverRoutes } from './service-resolver/routes';

export const routes: Routes = [
  {
    path: 'long-loading',
    children: longLoadingRoutes,
  },
  {
    path: 'path-params',
    children: pathParamsRoutes,
  },
  {
    path: 'form',
    children: formRoutes,
  },
  {
    path: 'service-resolver',
    children: serviceResolverRoutes,
  },
  {
    path: 'form-test',
    children: formTestRoutes,
  },
];
