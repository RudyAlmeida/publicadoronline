import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-login-carrinho',
  templateUrl: './login-carrinho.component.html',
  styleUrls: ['./login-carrinho.component.scss']
})
export class LoginCarrinhoComponent implements OnInit {
  login: any = {
    email: '',
    password: ''
  }
  constructor(private loginService: LoginService) { }

  ngOnInit(): void {
  }
  startLogin() {
    this.loginService.loginWithEmailAndPassword(this.login.email, this.login.password)
  }

}
