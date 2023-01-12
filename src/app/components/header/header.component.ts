import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import { Publicador } from 'src/app/types/types';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input() publicador: Publicador = {}

  constructor(private login: LoginService, private router: Router) {
    router.events.subscribe(val => {
      let user = this.login.getUser()
      this.publicador = user ? JSON.parse(user) : {}
    })
   }

  ngOnInit(): void {
  }

  singOutUser(){
    this.login.signOut()
    this.publicador = {}
  }

}
