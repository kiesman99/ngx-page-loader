import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { createPageResolver } from '../cpr/resolver.utils';
import { forkJoin } from 'rxjs';
import { PostsService } from '../services/posts.service';
import { ProfileService } from '../services/profile.service';
import { PostComponent } from '../shared/post.component';

export const {
  samplePageResolver,
  injectSamplePageResolverData,
} = createPageResolver({
  name: 'sample',
  resolveFn: ({route}) => {
    const userId = route.params['userId'];

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
  selector: 'app-page-resolver',
  standalone: true,
  imports: [CommonModule, PostComponent],
  template: `
    <h1>Page Resolver</h1>
    <p>Welcome {{rd.profileInfo.username}}</p>
    <app-post *ngFor="let post of rd.posts" [post]="post"/>
  `,
  styles: [
  ]
})
export class PageResolverComponent {
  // shorthand for resolverData
  rd = injectSamplePageResolverData();
}
