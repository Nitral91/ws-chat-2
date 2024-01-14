import {ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot} from '@angular/router';
import {inject} from "@angular/core";
import {AuthenticationService} from "../services/authentication/authentication.service";

export const authGuard: CanActivateFn = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authService = inject(AuthenticationService);
  const router = inject(Router);

  const token = authService.getToken();

  if (token && !authService.isTokenExpired(token)) {
    // Token is valid, allow access

    return true;
  } else {
    // Token is expired or not present, redirect to login
    router.navigate(['auth']);
    return false;
  }

  return true;
};
