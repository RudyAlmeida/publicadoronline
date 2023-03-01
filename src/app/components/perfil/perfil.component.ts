import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {
  @Input()  publicador: any = []
  @Input()  lastDay: number = 30;
  @Input() totals: any = {};
  today: number = new Date().getDate()

  constructor() { }

  ngOnInit(): void {
  }
  changePerfil() {
    setTimeout(() => {
      localStorage.setItem('publicador', JSON.stringify(this.publicador));
    }, 500)
  }

}
