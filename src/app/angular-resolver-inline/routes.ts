import { Routes } from "@angular/router";
import { angularInlineResolver, AngularResolverInlineComponent } from "./angular-resolver-inline.component";

export const angularResolverInlineRoutes: Routes = [
    {
        path: 'profile/:userId',
        resolve: {
            payload: angularInlineResolver
        },
        component: AngularResolverInlineComponent,
    }
];