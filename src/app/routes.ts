import { Routes } from "@angular/router";
import { angularResolverInlineRoutes } from "./angular-resolver-inline/routes";
import { angularResolverRoutes } from "./angular-resolver/routes";
import { pageResolverLongLoading } from "./page-resolver-long-loading/routes";
import { pageResolverWithParamsSchemaRoutes } from "./page-resolver-params/routes";
import { pageResolverRoutes } from "./page-resolver/routes";

export const routes: Routes = [
    {
        path: 'angular',
        children: angularResolverRoutes
    },
    {
        path: 'angular-inline',
        children: angularResolverInlineRoutes
    },
    {
        path: 'page-resolver',
        children: pageResolverRoutes
    },
    {
        path: 'page-resolver-with-params',
        children: pageResolverWithParamsSchemaRoutes
    },
    {
        path: 'page-resolver-long-loading',
        children: pageResolverLongLoading
    }
];