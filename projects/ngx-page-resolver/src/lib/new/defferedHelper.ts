import { catchError, map, merge, MonoTypeOperatorFunction, Observable, ObservableInput, ObservedValueOf, of, startWith, switchMap, tap } from 'rxjs';

const test = {
  one: '',
  two$: '',
  three$: of(2),
  passes: [],
};

export type NonDeferred<T> = {
  [P in keyof T as Exclude<P, `${string}$`>]: T[P];
};

export type NonDeferredKeys<T> = keyof NonDeferred<T>;

export type DeferredKeys<T> = Exclude<keyof T, NonDeferredKeys<T>>;
export type Deferred<T, D = Pick<T, DeferredKeys<T>>> = {
  [P in keyof D]: D[P] extends Observable<any> ? D[P] : Observable<D[P]>;
};

interface DeferredData<T> {
  data?: T;
  state: 'loading' | 'error' | 'idle';
  isLoading: boolean;
  isSuccess: boolean;
  hasError: boolean;
  error?: any;
}

function initialDeferredData<T>(): DeferredData<T> {
  return {
    state: 'loading',
    isLoading: true,
    isSuccess: false,
    hasError: false
  };
}

function laodingDeferredData<T>(): DeferredData<T> {
  return {
    state: 'loading',
    isLoading: true,
    isSuccess: false,
    hasError: false
  }
};

function newDeferredValue<T>(data: T): DeferredData<T> {
  return {
    state: 'idle',
    data: data,
    isLoading: false,
    isSuccess: true,
    hasError: false
  };
}

function erroredDeferred<T>(error: unknown): DeferredData<T> {
  return {
    error,
    state: 'error',
    isLoading: false,
    isSuccess: false,
    hasError: true
  };
}

export function wrapDeferredInfo<T>(source: Observable<T>): Observable<DeferredData<T>> {
  return merge(
    of(initialDeferredData<T>()),
    source.pipe(
      map(value => newDeferredValue(value)),
      catchError(err => of(erroredDeferred<T>(err)))
    )
  )
} 