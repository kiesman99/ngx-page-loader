import { Routes } from '@angular/router';
import {
  longLoadingPageResolver,
  PageResolverLongLoadingComponent,
} from './page-resolver-long-loading.component';

export const pageResolverLongLoading: Routes = [
  {
    path: 'profile/:userId',
    resolve: longLoadingPageResolver,
    component: PageResolverLongLoadingComponent,
  },
];
