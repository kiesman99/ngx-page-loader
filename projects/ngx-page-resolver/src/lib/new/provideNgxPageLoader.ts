import { makeEnvironmentProviders } from "@angular/core";
import { GlobalStateService } from "./global-state.service";
import { PageLoaderStateService } from "./page-loader-state.service";

export const provideNgxPageLoader = () => {
    return makeEnvironmentProviders([
        PageLoaderStateService,
        GlobalStateService
    ]);
};