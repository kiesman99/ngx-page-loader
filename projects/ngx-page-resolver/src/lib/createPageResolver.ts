import { inject } from '@angular/core';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';
import { map, Observable } from 'rxjs';
import { z } from 'zod';
import { capitalize } from './utils';

// maybe needs reference to parent resolver
// needed to resolve parent data in collector
export type PageResolver<D extends object> = {
  data: ResolveFn<D>;
};

type CprResolveFnParams<
  PathParams,
  QueryParams,
> = {
  route: ActivatedRouteSnapshot;
  state: RouterStateSnapshot;
  params: PathParams;
  queryParams: QueryParams;
};
type CprResolveFn<
  R extends object,
  PathParams,
  QueryParams,
> = (
  params: CprResolveFnParams<PathParams, QueryParams>
) => ReturnType<ResolveFn<R>>;

type CreatePageResolverOptions<
  N extends string,
  R extends object,
  PathParams = any,
  QueryParams = any
> = {
  name: N;
  paramsSchema?: z.Schema<PathParams>;
  queryParamsSchema?: z.Schema<QueryParams>;
  resolveFn: CprResolveFn<R, PathParams, QueryParams>;
};

// TODO: Option to inject parent resolver
// collect data from parents like with route params
export const createPageResolver = <
  N extends string,
  R extends object,
  PathParams = any,
  QueryParams = any
>(
  options: CreatePageResolverOptions<
    N,
    R,
    PathParams,
    QueryParams
  >
) => {
  const {
    name,
    resolveFn,
    paramsSchema = z.any(),
    queryParamsSchema = z.any(),
  } = options;

  const pageResolver: PageResolver<R> = {
    data: (route, state) => {
      const pathParams = parseParams<PathParams>(state, paramsSchema);
      const queryParams = parseQueryParams<QueryParams>(
        route,
        queryParamsSchema
      );

      return resolveFn({
        route,
        state,
        params: pathParams,
        queryParams: queryParams,
      });
    },
  };

  const injectResolverData = () => {
    return (inject(ActivatedRoute).snapshot.data as PageResolver<R>).data as R;
  };

  const injectResolverData$ = () => {
    return (inject(ActivatedRoute).data as Observable<PageResolver<R>>).pipe(
      map((pageResolver) => pageResolver.data)
    );
  };

  return {
    [`${name}PageResolver`]: pageResolver,
    [`inject${capitalize(name)}PageResolverData`]: () => injectResolverData(),
    [`inject${capitalize(name)}PageResolverData$`]: () => injectResolverData$(),
  } as {
    [P in
      | `${N}PageResolver`
      | `inject${Capitalize<N>}PageResolverData`
      | `inject${Capitalize<N>}PageResolverData$`]: P extends `${N}PageResolver`
      ? PageResolver<R>
      : P extends `inject${Capitalize<N>}PageResolverData`
      ? () => R
      : P extends `inject${Capitalize<N>}PageResolverData$`
      ? () => Observable<R>
      : never;
  };
};

function parseQueryParams<QueryParams>(
  route: ActivatedRouteSnapshot,
  queryParamsSchema: z.Schema<QueryParams> = z.any()
) {
  const res = queryParamsSchema.safeParse(route.queryParams);
  if (!res.success) {
    throw new Error(`Query params could not be parsed`, { cause: res.error });
  }

  return res.data;
}

function parseParams<PathParams>(
  state: RouterStateSnapshot,
  paramsSchema: z.Schema<PathParams> = z.any()
) {
  const allParams = collectRouteParams(state);
  const res = paramsSchema.safeParse(allParams);
  if (!res.success) {
    throw new Error(`Path params could not be parsed`, { cause: res.error });
  }

  return res.data;
}

function collectRouteParams(routerStateSnapshot: RouterStateSnapshot) {
  let params = {};
  const stack: ActivatedRouteSnapshot[] = [routerStateSnapshot.root];
  while (stack.length > 0) {
    const route = stack.pop();
    params = { ...params, ...route?.params };
    if (route?.children) {
      stack.push(...route.children);
    }
  }
  return params;
}

// function collectParentData<R extends object>(pageResolver: PageResolver<R>) {
//   let data = {};
//   while (pageResolver) {
//     data = { ...data, ...pageResolver.data };
//     pageResolver = pageResolver.parentResolver;
//   }
// }
