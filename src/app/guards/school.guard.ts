import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from '../services/login.service';

@Injectable({
  providedIn: 'root'
})
export class SchoolGuard implements CanActivate {
  constructor(private router: Router, private login: LoginService) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return new Observable((obs) => {
        let user = this.login.loginCongregation()
        user ? obs.next(true) : this.router.navigate(['/escola/login']), obs.next(false)
      })
  }
}
