import { Observable, ObservableInput, ObservedValueOf, of } from 'rxjs';

const test = {
  one: '',
  two$: '',
  three$: of(2),
  passes: [],
};

export type NonDeferred<T> = {
  [P in keyof T as Exclude<P, `${string}$`>]: T[P];
};

export type NonDeferredKeys<T> = keyof NonDeferred<T>;

export type DeferredKeys<T> = Exclude<keyof T, NonDeferredKeys<T>>;
export type Deferred<T, D = Pick<T, DeferredKeys<T>>> = {
  [P in keyof D]: D[P] extends Observable<any> ? D[P] : Observable<D[P]>;
};

type Test = NonDeferred<typeof test>;
type TestKeys = NonDeferredKeys<typeof test>;
type TestDeferredKeys = DeferredKeys<typeof test>;
type TestDeferred = Deferred<typeof test>;

type ReturnType = Record<string, Observable<any>>;

const DDD: ReturnType = {
  one: of(''),
};

const sample = <A extends ReturnType>(fn: () => A): A => {
  return fn();
};

const see = sample(() => {
  return { dawd: of(''), doesItWork$: of('awda'), anotherOne: of('nope') };
});


type DOfSee = ObservedValueOf<Deferred<typeof see>['doesItWork$']>