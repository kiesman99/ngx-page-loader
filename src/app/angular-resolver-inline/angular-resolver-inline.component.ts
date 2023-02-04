import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, ResolveFn } from '@angular/router';
import { Post, ProfileInfo } from '../models/models';
import { forkJoin } from 'rxjs';
import { PostsService } from '../services/posts.service';
import { ProfileService } from '../services/profile.service';
import { PostComponent } from '../shared/post.component';

interface AngularInlineResolverData {
  posts: Post[];
  profileInfo: ProfileInfo;
};

export const angularInlineResolver: ResolveFn<AngularInlineResolverData> = (route, state) => {
  const userId = route.params['userId'];

  const profileService = inject(ProfileService);
  const postsService = inject(PostsService);

  const profileInfo$ = profileService.getProfileInfo(userId);
  const posts$ = postsService.getUserPosts(userId);

  return forkJoin({
    posts: posts$,
    profileInfo: profileInfo$,
  });
};

@Component({
  selector: 'app-angular-resolver-inline',
  standalone: true,
  imports: [CommonModule, PostComponent],
  template: `
    <h1>Angular Resolver Inline</h1>
    <p>Welcome {{data.profileInfo.username}}</p>
    <app-post *ngFor="let post of data.posts" [post]="post"/>
  `,
  styles: [
  ]
})
export class AngularResolverInlineComponent {
  route = inject(ActivatedRoute);
  data = this.route.snapshot.data['payload'] as AngularInlineResolverData;
}
