import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-login-congregation',
  templateUrl: './login-congregation.component.html',
  styleUrls: ['./login-congregation.component.scss']
})
export class LoginCongregationComponent implements OnInit {
  login: any = {
    email: '',
    password: ''
  }
  constructor(private loginService: LoginService) { }

  ngOnInit(): void {
  }
  startLogin(){
    this.loginService.loginWithEmailAndPassword(this.login.email, this.login.password)
  }

}
