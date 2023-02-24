import {
  EnvironmentInjector,
  inject,
  InjectionToken,
  Provider,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { z } from 'zod';
import { NonDeferred } from './defferedHelper';
import { PageLoader } from './page-loader';

export interface LoaderFnOptions<PathParams, QueryParams> {
  injector: EnvironmentInjector;
  params: PathParams;
  queryParams: QueryParams;
}

export type LoaderFn<Data, PathParams, QueryParams> = (
  options: LoaderFnOptions<PathParams, QueryParams>
) => { [P in keyof Data]: Observable<Data[P]> };

export const LoaderFnToken = new InjectionToken<LoaderFn<unknown, any, any>>(
  'ngx-page-resolver-loader-fn'
);

export const PathParamsSchemaToken = new InjectionToken<z.Schema>(
  'ngx-page-resolver-path-params-schema'
);
export const QueryParamsSchemaToken = new InjectionToken<z.Schema>(
  'ngx-page-resolver-query-params-schema'
);

type CreatePageLoaderOptions<Data, PathParams, QueryParams> = {
  loader: LoaderFn<Data, PathParams, QueryParams>;
  pathParamsSchema?: z.Schema<PathParams>;
  queryParamsSchema?: z.Schema<QueryParams>;
};

export const createPageLoader = <Data, PathParams = any, QueryParams = any>(
  config: CreatePageLoaderOptions<Data, PathParams, QueryParams>
) => {
  const { loader, queryParamsSchema, pathParamsSchema } = config;

  const PAGELOADER = new InjectionToken<PageLoader<Data, PathParams, QueryParams>>('ngx-page-resolver-page-loader');

  const factory = <Provider>[
    {
      provide: PathParamsSchemaToken,
      useValue: pathParamsSchema ?? z.any(),
    },
    {
      provide: QueryParamsSchemaToken,
      useValue: queryParamsSchema ?? z.any(),
    },
    {
      provide: LoaderFnToken,
      useValue: loader,
    },
    {
      provide: PAGELOADER,
      useClass: PageLoader<Data, PathParams, QueryParams>
    },
    {
      provide: PageLoader<Data, PathParams, QueryParams>,
      deps: [LoaderFnToken, PathParamsSchemaToken, QueryParamsSchemaToken],
      useFactory: () => {
        const pageLoader = inject(PAGELOADER);
        pageLoader.init();
        return pageLoader;
      },
    },
  ];

  const injectPageLoader = () => {
    return inject<PageLoader<Data, PathParams, QueryParams>>(PageLoader);
  };

  const injectDeferredData = () => {
    return injectPageLoader().deferred;
  };

  const injectPathParams = () => {
    const route = inject(ActivatedRoute);
    return route.params as Observable<PathParams>;
  };

  const injectQueryParams = () => {
    const route = inject(ActivatedRoute);
    return route.queryParams as Observable<QueryParams>;
  };

  return {
    injectPageLoader,
    providePageLoader: () => factory,
    injectPathParams,
    injectQueryParams,
    injectDeferredData
  };
};
