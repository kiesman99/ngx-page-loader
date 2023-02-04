import { Injectable } from '@angular/core';
import { delay, of } from 'rxjs';
import { Post } from '../models/models';

const posts: Post[] = [
  { title: 'post-1', content: 'some cool content' },
  { title: 'post-2', content: 'typesafety is awesome' },
  { title: 'post-3', content: 'yay!' },
];

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  getUserPosts(userId: string) {
    return of(posts);
  }

  getLongLoadingPosts(userId: string) {
    return of(posts).pipe(delay(5000));
  }
}
