// import { Component, inject } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { RouterModule } from '@angular/router';
// import { createPageResolver } from 'ngx-page-resolver';
// import { ProfileService } from '../services/profile.service';
// import { forkJoin } from 'rxjs';

// export const {
//   parentPageResolver,
//   injectParentPageResolverData,
// } = createPageResolver({
//   name: 'parent',
//   resolveFn: () => {
//     const profileInfo$ = inject(ProfileService).getProfileInfo('1');

//     return forkJoin({
//       profileInfo: profileInfo$
//     });
//   }
// });

// @Component({
//   selector: 'app-page-resolver-parent',
//   standalone: true,
//   imports: [CommonModule, RouterModule],
//   template: `
//     <h1>Page Resolver Parent</h1>
//     <p>Welcome {{rd.profileInfo.username}}</p>

//     <hr>

//     <router-outlet></router-outlet>
//   `,
//   styles: [
//   ]
// })
// export class PageResolverParentComponent {
//   rd = injectParentPageResolverData();
// }
