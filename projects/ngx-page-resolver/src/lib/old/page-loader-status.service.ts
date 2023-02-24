import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, debounceTime, distinctUntilChanged } from 'rxjs';

export type PageLoaderStatus = 'idle' | 'submitting' | 'loading';

@Injectable({
  providedIn: 'root',
})
export class PageLoaderStatusService {
  #status$ = new BehaviorSubject<PageLoaderStatus>('idle');
  status$ = this.#status$
    .asObservable()
    .pipe(distinctUntilChanged(), debounceTime(100));

  updateStatus(status: PageLoaderStatus) {
    this.#status$.next(status);
  }
}

export function injectPageLoaderStatus() {
  return inject(PageLoaderStatusService).status$;
}
