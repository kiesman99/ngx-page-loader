// import { Component, inject } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { createPageResolver } from 'ngx-page-resolver';
// import { PostsService } from '../services/posts.service';
// import { forkJoin, of } from 'rxjs';
// import { PostComponent } from "../shared/post.component";
// import { parentPageResolver } from './page-resolver-parent.component';

// export const {
//   nestedPageResolver,
//   injectNestedPageResolverData
// } = createPageResolver({
//   name: 'nested',
//   resolveFn: ({  }) => {
//     const data = any;
//     const posts$ = inject(PostsService).getUserPosts('1');

//     return forkJoin({
//       posts: posts$,
//       profileInfo: of(data?.profileInfo)
//     });
//   }
// });

// @Component({
//     selector: 'app-page-resolver-nested',
//     standalone: true,
//     template: `
//     <p>Hello {{ rd.profileInfo?.username ?? 'info lost' }} from child!</p>

//     <app-post *ngFor="let post of rd.posts" [post]="post" />
//   `,
//     styles: [],
//     imports: [CommonModule, PostComponent]
// })
// export class PageResolverNestedComponent {
//   rd = injectNestedPageResolverData();
// }
