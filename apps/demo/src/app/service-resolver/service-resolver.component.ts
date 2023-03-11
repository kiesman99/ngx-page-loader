import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  createPageLoader,
  injectPageLoaderState,
  wrapDeferredInfo,
} from 'ngx-page-loader';
import { repeat, take } from 'rxjs';
import { z } from 'zod';
import { DemoService } from '../demo.service';

const {
  injectPageLoader,
  providePageLoader,
  injectQueryParams,
  injectDeferredData,
} = createPageLoader({
  queryParamsSchema: z.object({
    id: z.coerce.number().optional(),
  }),
  loader: ({ injector, queryParams }) => {
    const demoService = injector.get(DemoService);

    const id = queryParams.id ?? Math.floor(Math.random() * 100) + 1;

    if (id >= 70) {
      throw new Error(`something really bad happened ${id}`);
    }

    const lateTodo$ = demoService.loadTodo(id, 5000);

    return {
      todo: demoService.loadTodo(id),
      lateTodo$,
    };
  },
});

@Component({
  selector: 'app-service-resolver',
  standalone: true,
  imports: [CommonModule],
  template: `
    <ng-container *ngIf="pageLoader.data$ | async as data">
      <h1>Service Resolver</h1>
      <details>
        <summary>Json of loaderData</summary>
        <pre>{{ data | json }}</pre>
      </details>
      <p>State: {{ data.state }}</p>
      <button (click)="pageLoader.invalidate()" *ngIf="!data.error">
        Invalidate
      </button>
      <br />
      <button (click)="setRandomId()">Set Random Query-Param ID</button>
      <br />
      <button (click)="clearQueryParamId()">Clear id from query params</button>
      <br />
      <button (click)="submit()">Submit</button>

      <hr />

      <ng-container *ngIf="queryParams$ | async as queryParams">
        <p>Quer-Param ID: {{ queryParams.id ?? 'not defined' }}</p>
      </ng-container>

      <div *ngIf="data.error as error" class="warning">
        <p>Error:</p>
        <button (click)="pageLoader.invalidate()">RETRY</button>
        <pre>{{ error }}</pre>
      </div>

      <ng-container *ngIf="!data.error && data.data">
        <h2>Title: {{ data.data.todo.title }}</h2>
        <p>ID: {{ data.data.todo.id }}</p>
        <p>{{ data.data.todo.done }}</p>
      </ng-container>
    </ng-container>

    <div class="longLoading">
      <h2>Late Data</h2>
      <ng-container *ngIf="latePost$ | async as latePostData">
        <details>
          <summary>Json of latePostData</summary>
          <pre>{{ latePostData | json }}</pre>
        </details>
        <p *ngIf="latePostData.isLoading">Loading...</p>
        <p *ngIf="latePostData.hasError">{{ latePostData.error }}</p>
        <pre *ngIf="latePostData.isSuccess">{{ latePostData.data | json }}</pre>
      </ng-container>
    </div>
  `,
  styles: [
    `
      .warning {
        padding: 10px;
        border: 2px solid red;
        border-radius: 15px;
      }

      .longLoading {
        margin-top: 10px;
        padding: 10px;
        border: 2px solid purple;
        border-radius: 15px;
      }
    `,
  ],
  providers: [providePageLoader()],
})
export class ServiceResolverComponent {
  pageLoader = injectPageLoader();
  state$ = injectPageLoaderState();
  deferred = injectDeferredData();

  latePost$ = wrapDeferredInfo(this.deferred.lateTodo$);

  queryParams$ = injectQueryParams();

  private readonly router = inject(Router);

  setRandomId() {
    const id = Math.floor(Math.random() * 100) + 1;
    this.router.navigate([], {
      queryParams: { id },
    });
  }

  clearQueryParamId() {
    this.router.navigate([], {
      queryParams: {},
    });
  }

  submit() {
    const { queryParams, data } = this.pageLoader.snapshot;

    this.deferred.lateTodo$
      .pipe(repeat({ delay: 1000 }), take(1))
      .subscribe((data) => console.log(data));

    console.log('id from queryparam', queryParams.id);
  }
}
