import { SocialAuthService } from '@abacritt/angularx-social-login';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private authService: SocialAuthService, private router: Router) { }

  login(){
    this.authService.authState.subscribe((user : any) => {
      user.showVideo = "true"
      localStorage.setItem('publicador', JSON.stringify(user));
      this.router.navigate(['/relatorio']);
    })
  }
  getUser(){
    let user;
    return user = localStorage.getItem('publicador');
  }
  signOut(): void {
    localStorage.clear()
    this.router.navigate(['/login']);
    this.authService.signOut();
  }
}
