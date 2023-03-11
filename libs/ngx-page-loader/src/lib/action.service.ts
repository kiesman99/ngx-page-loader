import { inject, Injectable } from '@angular/core';
import { catchError, isObservable, Observable, of, take, tap } from 'rxjs';
import { PageLoaderStateService } from './page-loader-state.service';

type ActionFn<T> = () => Observable<T> | Promise<T> | T;

@Injectable()
export class ActionService {
  private readonly stateService = inject(PageLoaderStateService);

  action<T>(
    actionFn: ActionFn<T>,
    options: {
      onSuccess?: (data: T) => void;
      onError?: (error: any) => void;
    }
  ) {
    let res;
    try {
      res = actionFn();
    } catch (error) {
      options.onError?.(error);
      return;
    }

    if (!res) {
      return;
    }

    this.stateService.setState('action');

    let obs$: Observable<T>;

    if (isObservable(res)) {
      obs$ = res;
    } else {
      obs$ = of(res) as Observable<T>;
    }

    obs$
      .pipe(
        take(1),
        tap((data) => {
          options.onSuccess?.(data);
          this.stateService.setState('idle');
        }),
        catchError((error) => {
          options.onError?.(error);
          this.stateService.setState('error');
          return of();
        })
      )
      .subscribe();
  }
}
