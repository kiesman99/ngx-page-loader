import { Routes } from "@angular/router";
import { PageResolverReloadComponent, sampleReloadPageResolver } from "./page-resolver-reload.component";

export const pageResolverReloadRoutes: Routes = [
    {
        path: 'posts/:userId',
        resolve: sampleReloadPageResolver,
        runGuardsAndResolvers: 'always',
        component: PageResolverReloadComponent
    }
];