import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import {
  createPageResolver1,
  injectActionWatcher,
  injectPageLoaderStatus,
} from 'ngx-page-resolver';
import { forkJoin } from 'rxjs';
import { z } from 'zod';
import { Post } from '../models/models';
import { PostsService } from '../services/posts.service';
import { PostComponent } from '../shared/post.component';

export const { 
  sampleReloadPageResolver, 
  injectSampleReloadPageResolverData$ 
} =
createPageResolver1({
    name: 'sampleReload',
    paramsSchema: z.object({
      userId: z.string(),
    }),
    resolveFn: ({ params }) => {
      console.log('resolvin', 'sampleReload');
      const { userId } = params;
      const postsService = inject(PostsService);

      const posts$ = postsService.getUserPosts(userId);

      const latePost$ = postsService.getLongLoadingPosts('19');

      return forkJoin({
        posts: posts$,
        latePost$
      });
    },
  });

@Component({
  selector: 'app-page-resolver-reload',
  standalone: true,
  template: `
    <ng-container *ngIf="state$ | async as state">
      <ng-container *ngIf="rd$ | async as rd">
        <h1>Page Resolver reload</h1>
        <form #addPost="ngForm" (ngSubmit)="submit(addPost)">
          <input 
            type="text" 
            name="title" 
            [disabled]="state !== 'idle'"
            placeholder="Title" 
            [(ngModel)]="newPost.title" 
            required/>
          <br />
          <textarea 
            name="content"
            [disabled]="state !== 'idle'"
            cols="30" 
            rows="10" 
            placeholder="Content" 
            [(ngModel)]="newPost.content" 
            required></textarea>
          <br />
          <button type="submit" [disabled]="state !== 'idle'">Add</button>
        </form>
        <hr>
        <h2>Posts</h2>
        <app-post *ngFor="let post of rd.posts" [post]="post"/>
      </ng-container>
    </ng-container>
  `,
  styles: [],
  imports: [CommonModule, FormsModule, PostComponent],
})
export class PageResolverReloadComponent {
  private readonly router = inject(Router);
  private readonly postsService = inject(PostsService);
  private readonly aw = injectActionWatcher();
  readonly rd$ = injectSampleReloadPageResolverData$();
  readonly state$ = injectPageLoaderStatus();

  newPost: Post = {
    title: '',
    content: '',
  };

  submit(ngForm: NgForm) {
    const form = ngForm.form;
    if (form.invalid) {
      alert('Please fill all fields');
      return;
    }

    this.postsService
      .addPost(this.newPost)
      .pipe(this.aw.watchAction())
      .subscribe((post) => {
        this.router.navigate([]);
      });
  }
}
