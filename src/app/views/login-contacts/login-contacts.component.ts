import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-login-contacts',
  templateUrl: './login-contacts.component.html',
  styleUrls: ['./login-contacts.component.scss']
})
export class LoginContactsComponent implements OnInit {
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
