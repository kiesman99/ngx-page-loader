import {
  ENVIRONMENT_INITIALIZER,
  inject,
  makeEnvironmentProviders,
} from '@angular/core';
import { PageResolverHelper } from './resolver-helper.service';

export const providePageResolver = () => {
  return makeEnvironmentProviders([
    {
      provide: ENVIRONMENT_INITIALIZER,
      multi: true,
      deps: [PageResolverHelper],
      useValue() {
        inject(PageResolverHelper).init();
      },
    },
  ]);
};
