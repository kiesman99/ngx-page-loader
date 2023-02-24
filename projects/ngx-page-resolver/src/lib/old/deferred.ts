import { Observable, of, merge, map, catchError, share } from "rxjs";

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