import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ActionService, PageLoaderStateService } from 'ngx-page-loader';
import { delay, map, of } from 'rxjs';

function tooYoungValidator(age: number): ValidatorFn {
  return (control) => {
    const value = control.value;
    if (value < age) {
      return {
        tooYoung: {
          age,
        },
      };
    }
    return null;
  };
}

@Component({
  selector: 'app-form-test',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <a [routerLink]="[]" [queryParams]="" [fragment]="">dawda</a>

    <form [formGroup]="formGroup" (ngSubmit)="submit()">
      <input
        [formControl]="formGroup.controls.name"
        type="text"
        placeholder="Name"
      />
      <p *ngIf="formGroup.controls.name.hasError('required')">Required</p>
      <p *ngIf="formGroup.controls.name.hasError('minlength')">
        Name has to have a length of min 3 chars
      </p>
      <input [formControl]="formGroup.controls.age" placeholder="Age" />
      <p *ngIf="formGroup.controls.age.hasError('tooYoung')">
        You are too young to submit
      </p>
      <ng-container *ngIf="{ isInAction: isInAction$ | async } as vm">
        <button [disabled]="formGroup.invalid || vm.isInAction">Submit</button>
      </ng-container>
    </form>
  `,
})
export class FormTestComponent {
  @Input()
  sample?: string;

  private readonly actionService = inject(ActionService);

  private readonly fb = inject(NonNullableFormBuilder);

  private state$ = inject(PageLoaderStateService).state$;

  isInAction$ = this.state$.pipe(map((state) => state === 'action'));

  formGroup = this.fb.group({
    name: this.fb.control('', {
      validators: [Validators.required, Validators.minLength(3)],
    }),
    age: this.fb.control(0, {
      validators: [Validators.required, tooYoungValidator(18)],
    }),
  });

  submit() {
    this.actionService.action(
      () => {
        console.log('this.sample', this.sample);
        if (this.formGroup.invalid) {
          console.log('invalid');
          this.formGroup.markAllAsTouched();
          return;
        }

        const { name, age } = this.formGroup.value;

        if ((age as number) < 18) {
          throw new Error('You are too young');
        }

        return of('delayed').pipe(delay(3000));
      },
      {
        onSuccess: (data) => {
          console.log('success', data);
        },
        onError: (error) => {
          alert('Something went wrong');
        },
      }
    );
  }
}
