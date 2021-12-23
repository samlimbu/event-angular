import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
    ) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    console.log(this.authService.getUserProfile());
    let isAuthorized = false;
    route.data['role'].forEach((element: any) => {
      if (this.authService.getUserProfile()['roles'].includes(element)) {
        isAuthorized = true;
      }
    });
    if (!isAuthorized) {
      this.router.navigate(['home']);
    }
    return isAuthorized;
  }
}
