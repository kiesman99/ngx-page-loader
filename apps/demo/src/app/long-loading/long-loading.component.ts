import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { createPageLoader, wrapDeferredInfo } from 'ngx-page-loader';
import { DemoService } from '../demo.service';

const { providePageLoader, injectDeferredData } = createPageLoader({
  loader: ({ injector }) => {
    const demoService = injector.get(DemoService);

    const todos$ = demoService.loadTodos(3000);

    return {
      todos$,
    };
  },
});

@Component({
  selector: 'app-long-loading',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <h1>All Todos</h1>
    <ng-container *ngIf="todosDeferred$ | async as todosData">
      <p *ngIf="todosData.isLoading">Loading</p>
      <ul>
        <li *ngFor="let todo of todosData.data">
          <a [routerLink]="['/path-params', todo.id]">{{ todo.title }}</a>
          <p>{{ todo.done }}</p>
          <hr />
        </li>
      </ul>
    </ng-container>
  `,
  providers: [providePageLoader()],
})
export class LongLodingComponent {
  deferred = injectDeferredData();

  todosDeferred$ = wrapDeferredInfo(this.deferred.todos$);
}
