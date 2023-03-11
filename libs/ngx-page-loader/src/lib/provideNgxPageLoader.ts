import { makeEnvironmentProviders } from "@angular/core";
import { ActionService } from "./action.service";
import { GlobalStateService } from "./global-state.service";
import { PageLoaderStateService } from "./page-loader-state.service";

export const provideNgxPageLoader = () => {
    return makeEnvironmentProviders([
        GlobalStateService,
        PageLoaderStateService,
        ActionService
    ]);
};