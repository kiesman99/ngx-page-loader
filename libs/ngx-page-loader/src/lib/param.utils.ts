import { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";

export function collectRouteParams(routerStateSnapshot: RouterStateSnapshot) {
    let params = {};
    const stack: ActivatedRouteSnapshot[] = [routerStateSnapshot.root];
    while (stack.length > 0) {
      const route = stack.pop();
      params = { ...params, ...route?.params };
      if (route?.children) {
        stack.push(...route.children);
      }
    }
    return params;
  }