import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from "@angular/router";
import { PostsService } from "../services/posts.service";
import { ProfileService } from "../services/profile.service";
import { AngularResolverComponent } from "./angular-resolver.component";

export const angularResolverRoutes: Routes = [
    {
        path: 'profile/:userId',
        resolve: {
            posts: (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
                return inject(PostsService).getUserPosts(route.params['userId']);
            },
            profileInfo: (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
                return inject(ProfileService).getProfileInfo(route.params['userId']);
            }
        },
        component: AngularResolverComponent
    }
];