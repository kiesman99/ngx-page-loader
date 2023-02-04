import { inject, Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
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
  snackbar = inject(MatSnackBar);

  pageLoaderStatus = inject(PageLoaderStatusService);

  openSnackbar?: MatSnackBarRef<any>;

  watchAction<T>(): MonoTypeOperatorFunction<T> {
    return (source) =>
      source.pipe(
        // delay(2000),
        // tap(() => this.openSnackbar = this.snackbar.open('Loading')),
        // finalize(() => this.closeSnackbar())
        tap({
          subscribe: () => {
            this.openSnackbar = this.snackbar.open('Loading');
            this.pageLoaderStatus.updateStatus('submitting');
            // console.log('@@@','subscribe');
          },
          next: () => {
            this.closeSnackbar();
            this.pageLoaderStatus.updateStatus('idle');
            // console.log('@@@','next');
          },
          error: () => {
            this.pageLoaderStatus.updateStatus('idle');
            this.closeSnackbar();
            // console.log('@@@', 'error');
          },
        })
      );
  }

  private closeSnackbar() {
    this.openSnackbar?.dismiss();
    this.openSnackbar = undefined;
  }
}

export function injectActionWatcher() {
  return inject(ActionWatcher);
}
