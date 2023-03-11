import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormTestComponent } from "./form-test.component";

@Component({
    selector: 'app-form-wrapper',
    standalone: true,
    imports: [CommonModule, FormTestComponent],
    template: `
        <h1>Wrapper</h1>
        <app-form-test 
            sample="Heyho"
        />
    `,
})
export class FormWrapperComponent {

}