import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MonoTypeOperatorFunction,
  Observable,
  ObservableInput,
  of,
} from 'rxjs';

type FormData = {
  values: any;
};

function wrap<T>(sourceFn: () => Observable<T>): Observable<T> {
  return sourceFn();
}

function wrap2<T>(): MonoTypeOperatorFunction<T> {
  return (source) => source;
}

function create<T>(fn: (props: T) => ObservableInput<any>) {
    return fn;
}

type ActionFn<ActionProps, T = any> = (
  props: ActionProps
) => ObservableInput<T>;

function injectActions<D extends Record<string, ActionFn<unknown, any>>>(
  fns: D
): { [P in keyof D]: D[P] } {
  return fns;
}


@Component({
    selector: 'app-root',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
        <form>
            <input type="text">
        </form>
    `
})
class Sample {
  submit1(form: FormData) {
    wrap(() => {
      return this.http.post<any>('some-url', form.values);
    });
  }

  submit2(form: FormData) {
    this.http.post<any>('some-url', form.values).pipe(wrap2()).subscribe();
  }

  http = inject(HttpClient);

  submit3 = create((form: FormData) => {
    return this.http.post<any>('some-url', {});
  });

//   actions = injectActions({
//     createUpdate: (form: FormData) => {
//       return this.http.post<any>('some-url', form.values);
//     },
//     updatePost: (form: FormData) => {
//       return this.http.post<any>('some-url', form.values);
//     },
//   });

//   submit3(form: FormData) {
//     this.actions.createUpdate(form);
//   }
}
