import {
  EnvironmentInjector,
  inject,
  Injectable,
  OnDestroy,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  catchError,
  combineLatest,
  defer,
  forkJoin,
  map,
  Observable,
  of,
  repeat,
  ReplaySubject,
  shareReplay,
  Subject,
  Subscription,
  switchMap,
  take,
} from 'rxjs';
import {
  LoaderFn,
  LoaderFnToken,
  PathParamsSchemaToken,
  QueryParamsSchemaToken,
} from './createPageLoader';
import { Deferred, NonDeferred, NonDeferredKeys } from './defferedHelper';
import { GlobalStateService } from './global-state.service';
import {
  errorLoaderData,
  initialLoaderData,
  LoaderData,
  loadingLoaderData,
  newLoaderData,
} from './loader-data';
import { collectRouteParams } from './param.utils';

@Injectable()
export class PageLoader<T, PathParams, QueryParams> implements OnDestroy {
  private subscription = new Subscription();

  private invalidateSubject$ = new Subject<void>();

  private readonly globalStateService = inject(GlobalStateService);

  private environmentInjector = inject(EnvironmentInjector);

  private loaderFn = inject<LoaderFn<T, any, any>>(LoaderFnToken);

  private pathParamsSchema = inject(PathParamsSchemaToken);
  private queryParamsSchema = inject(QueryParamsSchemaToken);

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly dataSubject$ = new ReplaySubject<
    LoaderData<NonDeferred<T>, PathParams, QueryParams>
  >(1);
  data$ = this.dataSubject$.asObservable();

  private _snapshot!: LoaderData<NonDeferred<T>, PathParams, QueryParams>;

  deferred!: Deferred<T>;

  /**
   * A point in time snapshot of the loader data.
   * Be aware that this is not a stream of data, but a single snapshot.
   */
  get snapshot() {
    if (!this._snapshot) {
      throw new Error('No snapshot available');
    }

    return this._snapshot;
  }

  private params$ = combineLatest([
    this.route.params,
    this.route.queryParams,
  ]).pipe(
    map(([_, queryParams]) => {
      const allParams = collectRouteParams(this.router.routerState.snapshot);
      const pathParamsResult = this.pathParamsSchema.safeParse(allParams);
      const queryParamsResult = this.queryParamsSchema.safeParse(queryParams);

      if (!pathParamsResult.success) {
        throw new Error('Invalid path params', {
          cause: pathParamsResult.error,
        });
      }

      if (!queryParamsResult.success) {
        throw new Error('Invalid query params', {
          cause: queryParamsResult.error,
        });
      }

      return {
        pathParams: pathParamsResult.data as PathParams,
        queryParams: queryParamsResult.data as QueryParams,
      };
    })
  );

  fetcher$ = this.params$.pipe(
    switchMap((params) =>
      of(params).pipe(
        repeat({
          delay: () => {
            return this.invalidateSubject$;
          },
        })
      )
    ),
    switchMap(({ pathParams, queryParams }) =>
      defer(() => {
        const loaderObject = this.loaderFn({
          injector: this.environmentInjector,
          params: pathParams,
          queryParams: queryParams,
        });

        const { deferred, immediate } = extractImmediateObservales(loaderObject);

        if (!this.deferred) {
          this.deferred = deferred as any;
        }

        return forkJoin(immediate);
      }).pipe(
        map((data) =>
          newLoaderData<NonDeferred<T>, PathParams, QueryParams>(
            data as any,
            pathParams,
            queryParams
          )
        ),
        catchError((error) =>
          of(
            errorLoaderData<NonDeferred<T>, PathParams, QueryParams>(
              error,
              pathParams,
              queryParams
            )
          )
        )
      )
    ),
    shareReplay(1)
  );

  init() {
    this.params$
      .pipe(take(1))
      .subscribe((params) =>
        this.dataSubject$.next(
          initialLoaderData(params.pathParams, params.queryParams)
        )
      );

    this.subscription.add(
      this.fetcher$.subscribe((data) => {
        this.dataSubject$.next(data);
      })
    );

    this.subscription.add(
      this.dataSubject$.subscribe((data) => {
        this._snapshot = data;
      })
    );

    this.subscription.add(
      this.data$.pipe(map((data) => data.state)).subscribe((state) => {
        this.globalStateService.setState(state);
      })
    );
  }

  invalidate() {
    this.dataSubject$.next(
      loadingLoaderData<NonDeferred<T>, PathParams, QueryParams>(
        this._snapshot.data,
        this.snapshot.pathParams,
        this.snapshot.queryParams
      )
    );
    this.invalidateSubject$.next();
  }

  ngOnDestroy(): void {
    console.info('Cleaning Page Loder');
    this.subscription.unsubscribe();
  }
}
function extractImmediateObservales<T>(loaderObject: {
  [P in keyof T]: Observable<T[P]>;
}) {
  const immediate: Record<string, Observable<unknown>> = {};
  const deferred: Record<string, Observable<unknown>> = {};

  Object.keys(loaderObject).forEach((keyString) => {
    const key = keyString as keyof T;
    if (keyString.endsWith('$')) {
      deferred[keyString] =  loaderObject[key];
      return;
    }

    immediate[keyString] = loaderObject[key];
  });

  return {
    immediate,
    deferred,
  };
}
