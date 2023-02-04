import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { injectPageLoaderStatus, PageResolverHelper } from 'ngx-page-resolver';
import { map, tap } from 'rxjs';

@Component({
  selector: 'app-loading-indicator',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="loader-bg">
      <div
        *ngIf="status$ | async as width"
        class="loader"
        style="width: {{ width }}%"
      ></div>
    </div>
  `,
  styles: [
    `
      .loader-bg {
        width: 100%;
        height: 5px;
        background-color: rgba(0, 114, 152, 0.5);
      }
      .loader {
        width: 100%;
        height: 5px;
        background-color: rgba(0, 114, 152, 1);
      }
    `,
  ],
})
export class LoadingIndicatorComponent {
  constructor() {
    // inject(Router).events.subscribe(e => console.log(e));
    // injectPageLoaderStatus().subscribe(e => console.log(e));
    inject(PageResolverHelper).isLoading$.subscribe();
  }

  lastWidth = 100;

  status$ = injectPageLoaderStatus().pipe(
    map((status) => {
      switch (status) {
        case 'loading':
          return 50;
        case 'submitting':
          return 25;
        default:
          return 100;
      }
    }),
    tap((width) => (this.lastWidth = width))
  );
}
