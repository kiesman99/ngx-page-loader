# State for each observable

[SolidJS](https://start.solidjs.com/core-concepts/data-loading) has a `createResource` function that wraps a promise into a State like object with Meta-Information (state: isLoading | error...) and utility functions like `refetch` ([see here](https://www.solidjs.com/docs/latest/api#createresource)).

This could be adapted to introduce a per-observable based invalidation mechanism.

# Problem with LoaderFn return type

I do not want the user to wrap the oberservables into the appropiate rxjs method like `forkJoin`:

```ts
createPageResoler(() => {
    return forkJoin(
        books: http.get('...'),
        userPicture: deferred(http.get('...'))
    );
})
```

I'd rather have the user return an object of the type

```ts
type LoaderReturn = {
    [P in `${string}` | `${string}$`]: Observable<unknown>
}
```

This way i as lib author would wrap the return value of the `LoaderFn` into `forkJoin` to sequencially fetch the observables. In a later step each Observable with a key postfixed with **$** will be stripped and provieded as manually subscribeable observable (This is used for long-loading requests).

However strict types are lost when using the above `LoaderReturn`

# reading path configuration

https://stackoverflow.com/questions/58434389/typescript-deep-keyof-of-a-nested-object