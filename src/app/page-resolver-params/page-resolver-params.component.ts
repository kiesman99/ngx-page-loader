import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { PostsService } from '../services/posts.service';
import { ProfileService } from '../services/profile.service';
import { z } from 'zod';
import { PostComponent } from '../shared/post.component';
import { createPageResolver1 } from 'ngx-page-resolver';

export const {
  sampleWithParamsSchemaPageResolver,
  injectSampleWithParamsSchemaPageResolverData,
} = createPageResolver1({
  name: 'sampleWithParamsSchema',
  paramsSchema: z.object({
    userId: z.string(),
  }),
  resolveFn: ({params}) => {
    const { userId } = params;

    const profileService = inject(ProfileService);
    const postsService = inject(PostsService);
  
    const profileInfo$ = profileService.getProfileInfo(userId);
    const posts$ = postsService.getUserPosts(userId);
  
    return forkJoin({
      posts: posts$,
      profileInfo: profileInfo$,
    });
  }
}); 

@Component({
  selector: 'app-page-resolver-params',
  standalone: true,
  imports: [CommonModule, PostComponent],
  template: `
    <h1>Page Resolver with params</h1>
    <p>Welcome {{rd.profileInfo.username}}</p>
    <app-post *ngFor="let post of rd.posts" [post]="post"/>
  `,
  styles: [
  ]
})
export class PageResolverParamsComponent {
  rd = injectSampleWithParamsSchemaPageResolverData();
}
