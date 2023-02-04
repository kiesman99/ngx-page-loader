import { inject, Injectable } from '@angular/core';
import { MonoTypeOperatorFunction, tap } from 'rxjs';
import { PageLoaderStatusService } from './page-loader-status.service';

@Injectable({
  providedIn: 'root',
})
export class ActionWatcher {
  pageLoaderStatus = inject(PageLoaderStatusService);

  watchAction<T>(): MonoTypeOperatorFunction<T> {
    return (source) =>
      source.pipe(
        tap({
          subscribe: () => {
            this.pageLoaderStatus.updateStatus('submitting');
          },
          next: () => {
            this.pageLoaderStatus.updateStatus('idle');
          },
          error: () => {
            this.pageLoaderStatus.updateStatus('idle');
          },
        })
      );
  }
}

export function injectActionWatcher() {
  return inject(ActionWatcher);
}
