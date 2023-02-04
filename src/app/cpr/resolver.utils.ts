import { inject } from '@angular/core';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  ResolveFn, RouterStateSnapshot
} from '@angular/router';
import {
  catchError, map,
  merge,
  Observable,
  of, share
} from 'rxjs';
import { z } from 'zod';

export type PageResolver<D extends object> = {
  data: ResolveFn<D>;
};

type PageResolverData<
  T extends PageResolver<D>,
  D extends object = any
> = T extends PageResolver<infer F> ? F : never;

export const injectResolverData = <
  T extends PageResolver<D> = any,
  D extends object = any
>() => {
  return (inject(ActivatedRoute).snapshot.data as T).data as PageResolverData<
    T,
    D
  >;
};

export function capitalize(key: string): string {
  return key.charAt(0).toUpperCase() + key.slice(1);
}

export const createPageResolver = <
  N extends string,
  R extends object,
  PathParams = any,
  QueryParams = any
>(options: {
  name: N;
  paramsSchema?: z.Schema<PathParams>;
  queryParamsSchema?: z.Schema<QueryParams>;
  resolveFn: (params: {
    route: ActivatedRouteSnapshot;
    state: RouterStateSnapshot;
    params: PathParams;
    queryParams: QueryParams;
  }) => ReturnType<ResolveFn<R>>;
}) => {
  const {
    name,
    resolveFn,
    paramsSchema = z.any(),
    queryParamsSchema = z.any(),
  } = options;

  const pageResolver: PageResolver<R> = {
    data: (route, state) => {
      const allParams = collectRouteParams(state);
      if (paramsSchema) {
        const res = paramsSchema.safeParse(allParams);
        if (!res.success) {
          const cause = new Error(res.error.message);
          // return new Error(`Path params could not be parsed (${cause.message})`);
          console.error(cause);
          throw cause;
        }
      }

      if (queryParamsSchema) {
        const res = queryParamsSchema.safeParse(route.queryParams);
        if (!res.success) {
          const cause = new Error(res.error.message);
          // return new Error(`Query params could not be parsed (${cause.message})`);
          console.error(cause);
          throw cause;
        }
      }

      return resolveFn({
        route,
        state,
        params: allParams as any,
        queryParams: route.queryParams as any,
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
      ? () => PageResolverData<PageResolver<R>, R>
      : P extends `inject${Capitalize<N>}PageResolverData$`
      ? () => Observable<PageResolverData<PageResolver<R>, R>>
      : never;
  };
};

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

export interface DeferedData<T> {
  isLoading: boolean;
  data?: T;
  error: any | null;
}

const initialDeferredData = <R>(): DeferedData<R> => {
  return {
    isLoading: true,
    data: undefined,
    error: null,
  };
};

const successFullDeferredData = <R>(data: R): DeferedData<R> => {
  return {
    isLoading: false,
    data,
    error: null,
  };
};

const failedFullDeferredData = <R>(error: unknown): DeferedData<R> => {
  return {
    isLoading: false,
    data: undefined,
    error,
  };
};

export const deferred = <R>(
  observable: Observable<R>
): Observable<Observable<DeferedData<R>>> => {
  return of(
    merge(
      of(initialDeferredData<R>()),
      observable
        .pipe(
          map((data) => successFullDeferredData(data)),
          catchError((error) => of(failedFullDeferredData<R>(error)))
        )
        .pipe(share())
    )
  );
};
