import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { injectPageLoaderState } from 'ngx-page-loader';
import { map } from 'rxjs';

@Component({
  selector: 'app-loading-indicator',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="loader-bg">
      <div
        *ngIf="width$ | async as width"
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
  width$ = injectPageLoaderState().pipe(
    map((status) => {
      switch (status) {
        case 'loading':
          return 50;
        case 'action':
          return 25;
        default:
          return 100;
      }
    })
  );
}
