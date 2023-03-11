import { Routes } from "@angular/router";
import { FormTestComponent } from "./form-test.component";
import { FormWrapperComponent } from "./form-wrapper.component";

export const formTestRoutes: Routes = [
    {
        path: '',
        component: FormWrapperComponent
    }
];