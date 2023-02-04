import { Injectable } from '@angular/core';
import { ReplaySubject, shareReplay } from 'rxjs';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { delay, of } from 'rxjs';
import { Post } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  posts: Post[] = [
    { title: 'post-1', content: 'some cool content' },
  ];

  private _posts$ = new BehaviorSubject<Post[]>(this.posts);
  private posts$ = this._posts$.asObservable().pipe(shareReplay(2));

  getUserPosts(userId: string) {
    return of(this.posts).pipe(delay(1000));
  }

  getLongLoadingPosts(userId: string) {
    return of(this.posts).pipe(delay(5000));
  }

  addPost(post: Post): Observable<Post> {
    const copied = Object.assign({}, post);
    setTimeout(() => {
      this.posts.push(copied);
      this._posts$.next(this.posts);
    }, 2000);
    return of(post).pipe(delay(2000));
  }
}
