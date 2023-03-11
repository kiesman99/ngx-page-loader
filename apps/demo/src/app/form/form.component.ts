import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ActionService, createPageLoader } from "ngx-page-loader";
import { z } from "zod";
import { DemoService } from "../demo.service";

const { providePageLoader, injectPageLoader } = createPageLoader({
  queryParamsSchema: z.object({
    id: z.coerce.number(),
  }),
  loader: ({injector, queryParams}) => {
    const demoService = injector.get(DemoService);
    
    const todo = demoService.loadTodo(queryParams.id, 2000);
    
    return {todo};
  }
});

@Component({
  selector: "app-form",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <ng-container *ngIf="pl.data$ | async as data">
      <h1>Form</h1>
      <ng-container *ngIf="data?.data?.todo as todo">
        <p>Todo: {{ todo.title }}</p>
        <p>Done: {{ todo.done ? 'Yes' : 'No' }}</p>
        <button (click)="toggleTodo(todo.id)">Toggle Done</button>
      </ng-container>
    </ng-container>
  `,
  providers: [providePageLoader()],
})
export class FormComponent {
  pl = injectPageLoader();
  actionService = inject(ActionService);
  
  private demoService = inject(DemoService);
  
  toggleTodo(id: number) {
    this.actionService.action(() => {
      return this.demoService.toggleTodo(id, 3000);
    }, {
      onSuccess: () => {
        this.pl.invalidate();
      }
    });
  }
}