import { Routes } from "@angular/router";
import { PageResolverComponent, samplePageResolver } from "./page-resolver.component";

export const pageResolverRoutes: Routes = [
    {
        path: 'profile/:userId',
        resolve: samplePageResolver,
        component: PageResolverComponent
    }
];