import { inject, Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { LoaderState } from "./loader-data";

@Injectable()
export class GlobalStateService {
    private readonly stateSubject$ = new BehaviorSubject<LoaderState>('loading');
    state$ = this.stateSubject$.asObservable();

    setState(state: LoaderState) {
        this.stateSubject$.next(state);
    }
}

export const injectGlobalState = () => {
    return inject(GlobalStateService);
}