import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";
import { createPageLoader } from "ngx-page-loader";
import { z } from "zod";
import { DemoService } from "../demo.service";

const { providePageLoader, injectPageLoader } = createPageLoader({
  pathParamsSchema: z.object({
    id: z.coerce.number(),
  }),
  loader: ({injector, params}) => {
    const demoService = injector.get(DemoService);

    const todo = demoService.loadTodo(params.id);    
    
    return {todo};
  }
});

@Component({
  selector: "app-path-params",
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <ng-container *ngIf="pl.data$ | async as data">
      <h1>Path Params</h1>
      <p>Todo: {{data.data?.todo?.title}}</p>
      <span>
        <p>DONE: {{ data.data?.todo?.done ? 'Yes' : 'No' }}</p>
        <a [routerLink]="['/form']" [queryParams]="{ id: data.data?.todo?.id }">Edit</a>
      </span>
    </ng-container>
  `,
  providers: [providePageLoader()],
})
export class PathParamsComponent {
  pl = injectPageLoader();
}