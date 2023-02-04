import { inject, Injectable } from '@angular/core';
import {
  catchError,
  delay,
  finalize,
  MonoTypeOperatorFunction,
  tap,
  throwError,
} from 'rxjs';
import { PageLoaderStatusService } from './page-loader-status.service';

@Injectable({
  providedIn: 'root',
})
export class ActionWatcher {

  pageLoaderStatus = inject(PageLoaderStatusService);

  watchAction<T>(): MonoTypeOperatorFunction<T> {
    return (source) =>
      source.pipe(
        // delay(2000),
        // tap(() => this.openSnackbar = this.snackbar.open('Loading')),
        // finalize(() => this.closeSnackbar())
        tap({
          subscribe: () => {
            this.pageLoaderStatus.updateStatus('submitting');
            // console.log('@@@','subscribe');
          },
          next: () => {
            this.pageLoaderStatus.updateStatus('idle');
            // console.log('@@@','next');
          },
          error: () => {
            this.pageLoaderStatus.updateStatus('idle');
            // console.log('@@@', 'error');
          },
        })
      );
  }
}

export function injectActionWatcher() {
  return inject(ActionWatcher);
}
