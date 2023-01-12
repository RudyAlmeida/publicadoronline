import { GoogleLoginProvider, SocialAuthService } from '@abacritt/angularx-social-login';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { map, Observable } from 'rxjs';
import { LoginService } from '../services/login.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(private router: Router, private login: LoginService) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    asyncstate: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return new Observable((obs) => {
      let user = this.login.getUser()
      user ? obs.next(true) : this.router.navigate(['/login']), obs.next(false)
    })

  }

}
