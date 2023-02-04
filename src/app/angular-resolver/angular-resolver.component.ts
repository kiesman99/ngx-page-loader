import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PostComponent } from '../shared/post.component';

@Component({
  selector: 'app-angular-resolver',
  standalone: true,
  imports: [CommonModule, PostComponent],
  template: `
    <h1>Angular Resolver</h1>
    <p>Welcome {{data['profileInfo'].username}}</p>
    <app-post *ngFor="let post of data['posts']" [post]="post"/>
  `,
})
export class AngularResolverComponent {
  route = inject(ActivatedRoute);
  data = this.route.snapshot.data;
}
