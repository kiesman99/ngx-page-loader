import { inject, Injectable } from "@angular/core";
import { BehaviorSubject, distinctUntilChanged } from "rxjs";
import { PageLoader } from "./page-loader";

export type PageLoaderState = 'initial' |  'idle' | 'loading' | 'error' | 'action';


@Injectable()
export class PageLoaderStateService {
    private stateSubject$ = new BehaviorSubject<PageLoaderState>('initial');
    state$ = this.stateSubject$.asObservable().pipe(
        distinctUntilChanged()
    );

    setState(state: Exclude<PageLoaderState, 'initial'>) {
        this.stateSubject$.next(state);
    }
}

export const injectPageLoaderState = () => inject(PageLoaderStateService).state$;