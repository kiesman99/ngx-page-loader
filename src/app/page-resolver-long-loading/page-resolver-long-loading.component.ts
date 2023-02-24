import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { PostsService } from '../services/posts.service';
import { ProfileService } from '../services/profile.service';
import { z } from 'zod';
import { PostComponent } from '../shared/post.component';
import { createPageResolver1, deferred } from 'ngx-page-resolver';

export const {
  longLoadingPageResolver,
  injectLongLoadingPageResolverData,
} = createPageResolver1({
  name: 'longLoading',
  paramsSchema: z.object({
    userId: z.string(),
  }),
  resolveFn: ({params}) => {
    const { userId } = params;

    const profileService = inject(ProfileService);
    const postsService = inject(PostsService);
  
    const profileInfo$ = profileService.getProfileInfo(userId);
    const longLoadingPosts$ = postsService.getLongLoadingPosts(userId);
  
    return forkJoin({
      longLoadingPosts$: deferred(longLoadingPosts$),
      profileInfo: profileInfo$,
    });
  }
}); 

@Component({
  selector: 'app-page-resolver-long-loading',
  standalone: true,
  imports: [CommonModule, PostComponent],
  template: `
    <h1>Page Resolver long loading</h1>
    <p>Welcome {{rd.profileInfo.username}}</p>
    <ng-container *ngIf="rd.longLoadingPosts$ | async as postsLoader">
      <p *ngIf="postsLoader.isLoading">Loading...</p>
      <p *ngIf="postsLoader.error">Ups. something wrong happened</p>
      <app-post *ngFor="let post of postsLoader.data" [post]="post"/>
    </ng-container>
  `,
  styles: [
  ]
})
export class PageResolverLongLoadingComponent {
  rd = injectLongLoadingPageResolverData();
}
