/*
 * Public API Surface of ngx-page-resolver
 */

export * from './lib/new/createPageLoader';
export * from './lib/new/page-loader-state.service';

export * from './lib/new/provideNgxPageLoader';
export * from './lib/new/global-state.service';

export * from './lib/new/defferedHelper';

// --- old

export * from './lib/old/provide-page-resolver';
export * from './lib/old/resolver-helper.service';
export * from './lib/old/page-loader-status.service';
export { createPageResolver1 } from './lib/old/createPageResolver';
export * from './lib/old/deferred';
export * from './lib/old/action.utils';