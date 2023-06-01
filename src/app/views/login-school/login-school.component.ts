import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-login-school',
  templateUrl: './login-school.component.html',
  styleUrls: ['./login-school.component.scss']
})
export class LoginSchoolComponent implements OnInit {
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
