import { inject, Injectable } from '@angular/core';
import {
  NavigationCancel,
  NavigationError,
  ResolveEnd,
  ResolveStart,
  Router,
} from '@angular/router';
import { filter, map, merge, shareReplay, startWith, Subject, tap } from 'rxjs';
import { PageLoaderStatusService } from './page-loader-status.service';

@Injectable({
  providedIn: 'root',
})
export class PageResolverHelper {
  pageLoaderStatus = inject(PageLoaderStatusService);

  #errors$ = new Subject<Error>();
  errors$ = this.#errors$.asObservable();

  private resolverStart$ = inject(Router).events.pipe(
    filter((e) => e instanceof ResolveStart),
    map(() => true)
  );

  private resolveEnd$ = inject(Router).events.pipe(
    filter((e) => e instanceof ResolveEnd),
    map(() => false)
  );

  private navigationError$ = inject(Router).events.pipe(
    filter((e) => e instanceof NavigationError),
    map((e) => e as NavigationError),
    tap((error) => this.#errors$.next(error.error)),
    map(() => false)
  );

  private navigationCancel$ = inject(Router).events.pipe(
    filter((e) => e instanceof NavigationCancel),
    map(() => false)
  );

  isLoading$ = merge(
    this.resolverStart$,
    this.resolveEnd$,
    this.navigationError$,
    this.navigationCancel$
  ).pipe(startWith(false), shareReplay(1));

  constructor() {
    this.isLoading$.subscribe((isLoading) => {
      if (isLoading) { 
        this.pageLoaderStatus.updateStatus('loading');
        return;
      }

      this.pageLoaderStatus.updateStatus('idle');
    });
  }
}

export const injectPageResolverError = () => {
  return inject(PageResolverHelper).errors$;
};
