import { EventEmitter, OnInit, Output } from '@angular/core';
import { Component } from '@angular/core';
import { LoginService } from './services/login.service';
import { Publicador } from './types/types';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    publicador: Publicador = {}

    @Output() emitPublicador: EventEmitter<void> = new EventEmitter();

    constructor(private login: LoginService) { }
  
    ngOnInit(): void {
      this.login.login()
      let user = this.login.getUser()
      this.publicador = user ? JSON.parse(user) : {}
    }
  
}
