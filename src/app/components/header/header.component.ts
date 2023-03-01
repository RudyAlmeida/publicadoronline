import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs';
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
    router.events.pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd),
    map(eventUrl => {
      if(eventUrl.url == "/relatorio"){
        let user = this.login.getUser()
        this.publicador = user ? JSON.parse(user) : {}
      } else if (eventUrl.url == "/congregacao"){
        let user = this.login.loginSuper()
        let parsed = user ? JSON.parse(user) : {}
        this. publicador = parsed[0]
      } else if (eventUrl.url == "/contatos"){
        let user = this.login.loginCongregation()
        let parsed = user ? JSON.parse(user) : {}
        this. publicador = parsed[0]
      }
    })).subscribe()
    /* router.events.subscribe(val => {
      
    }) */
   }

  ngOnInit(): void {
  }

  singOutUser(){
    this.login.signOut()
    this.publicador = {}
  }

}
