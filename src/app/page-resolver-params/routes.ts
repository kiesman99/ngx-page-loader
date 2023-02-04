import { Routes } from '@angular/router';
import {
  PageResolverParamsComponent,
  sampleWithParamsSchemaPageResolver,
} from './page-resolver-params.component';

export const pageResolverWithParamsSchemaRoutes: Routes = [
  {
    path: 'profile/:userId',
    resolve: sampleWithParamsSchemaPageResolver,
    component: PageResolverParamsComponent,
  },
];
