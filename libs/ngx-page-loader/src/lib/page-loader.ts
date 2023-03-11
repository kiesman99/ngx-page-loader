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
  tap,
  zip,
} from 'rxjs';
import {
  LoaderFn,
  LoaderFnToken,
  PathParamsSchemaToken,
  QueryParamsSchemaToken,
} from './createPageLoader';
import { Deferred, NonDeferred } from './defferedHelper';
import { GlobalStateService } from './global-state.service';
import {
  errorLoaderData,
  initialLoaderData,
  LoaderData,
  loadingLoaderData,
  newLoaderData,
} from './loader-data';
import { PageLoaderStateService } from './page-loader-state.service';
import { collectRouteParams } from './param.utils';

@Injectable()
export class PageLoader<T, PathParams, QueryParams> implements OnDestroy {
  private subscription = new Subscription();

  private invalidateSubject$ = new Subject<void>();

  // TODO: see if globalStateService is needed
  private readonly globalStateService = inject(GlobalStateService);

  private readonly stateService = inject(PageLoaderStateService);

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
        //         TODO: use cause when possible
        //         throw new Error('Invalid path params', {
        //           cause: pathParamsResult.error,
        //         });
        console.log(pathParamsResult.error);
        throw new Error('Invalid path params');
      }

      if (!queryParamsResult.success) {
        //         TODO: use cause when possible
        //         throw new Error('Invalid path params', {
        //         throw new Error('Invalid query params', {
        //           cause: queryParamsResult.error,
        //         });
        console.log(queryParamsResult.error);
        throw new Error('Invalid query params');
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
        
        console.log('loaderObj', loaderObject);

        const { deferred, immediate } =
          extractImmediateObservales(loaderObject);
        
        console.log('deferred', deferred);
        console.log('immediate', immediate);

        if (!this.deferred) {
          this.deferred = deferred as any;
        }

        //return forkJoin(immediate);
        return combineLatest(immediate);
      }).pipe(
        tap(data => console.log('inner', data)),
        map((data) =>
          newLoaderData<NonDeferred<T>, PathParams, QueryParams>(
            data as any,
            pathParams,
            queryParams
          )
        ),
        tap((data) => console.log('afterMap', data)),
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
    tap((data) => console.log(data)),
    shareReplay(1)
  );

  init() {
    console.log('init');
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
    console.log('Cleaning Page Loder');
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
      deferred[keyString] = loaderObject[key];
      return;
    }

    immediate[keyString] = loaderObject[key];
  });

  return {
    immediate,
    deferred,
  };
}
