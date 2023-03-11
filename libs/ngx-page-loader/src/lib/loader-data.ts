export type LoaderState = 'idle' | 'loading' | 'error';

export interface LoaderMetaData {
    timestamp: number;
}

export interface LoaderData<T, PathParams, QueryParams> {
  data?: T;
  error?: any;
  state: LoaderState;
  isInitialLoad: boolean;
  pathParams: PathParams;
  queryParams: QueryParams;
  metadata: LoaderMetaData;
}

export const initialLoaderData = <T, PathParams, QueryParams>(
  pathParams: PathParams,
  queryParams: QueryParams
): LoaderData<T, PathParams, QueryParams> => {
  return {
    state: 'loading',
    pathParams,
    queryParams,
    isInitialLoad: true,
    metadata: {
        timestamp: Date.now(),
    },
  };
};

export const loadingLoaderData = <T, PathParams, QueryParams>(
    data: T | undefined = undefined,
    pathParams: PathParams,
    queryParams: QueryParams,
): LoaderData<T, PathParams, QueryParams> => {
  return {
    isInitialLoad: false,
    pathParams,
    queryParams,
    state: 'loading',
    data,
    metadata: {
        timestamp: Date.now(),
    },
  };
};

export const errorLoaderData = <T, PathParams, QueryParams>(
  error: any,
  pathParams: PathParams,
  queryParams: QueryParams
): LoaderData<T, PathParams, QueryParams> => {
  return {
    isInitialLoad: false,
    pathParams,
    queryParams,
    state: 'error',
    error,
    metadata: {
        timestamp: Date.now(),
    },
  };
};

export const newLoaderData = <T, PathParams, QueryParams>(
  data: T,
  pathParams: PathParams,
  queryParams: QueryParams
): LoaderData<T, PathParams, QueryParams> => {
  return {
    isInitialLoad: false,
    pathParams,
    queryParams,
    state: 'idle',
    data,
    metadata: {
        timestamp: Date.now(),
    },
  };
};
