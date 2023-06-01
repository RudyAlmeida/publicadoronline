import { Component, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CalendarView } from 'angular-calendar';
import { Subject } from 'rxjs';
import { RegistriesService } from 'src/app/services/registries.service';
import { EventEmitter } from 'stream';

@Component({
  selector: 'app-totals',
  templateUrl: './totals.component.html',
  styleUrls: ['./totals.component.scss']
})
export class TotalsComponent implements OnInit {

  @Input() view: CalendarView = CalendarView.Month;
  @Input() viewDate: Date = new Date();
  @ViewChild('modalWhatsapp', { static: true }) modalWhatsapp!: TemplateRef<any>;
  @Input()  publicador: any = []


  @Input() totals: any = {
    email: '',
    hours: 0,
    bonus: 0,
    total: 0,
    magazines: 0,
    books: 0,
    revisits: 0,
    studies: 0
  };
  sendRegistryButton: boolean = false;
  sendWhatsapp: boolean = true;
  elder: string = '';
  elderNumber: string = '';
  lastDay: number = 30;
  refresh = new Subject<void>();


  constructor( private modal: NgbModal) { }

  ngOnInit(): void {
  }
  
  openWhatsappModal() {
    this.modal.open(this.modalWhatsapp, { size: 'lg' });
  }
  checkWhatsapp() {
    this.sendWhatsapp = this.elder.length >= 3 && this.elderNumber.toString().length >= 10 ? false : true;
  }
  sendRegistry() {
    let text = ''
    if(this.totals.bonus > 0){
      text = window.encodeURIComponent(`Olá ${this.elder} segue o meu relatório \nHoras: ${Math.floor(this.totals.hours / 60)}\nVídeos: ${this.totals.magazines}\nPublicações: ${this.totals.books}\nRevisitas: ${this.totals.revisits}\nEstudos: ${this.totals.studies} \nObs: Horas Bonus: \nHoras: ${Math.floor(this.totals.bonus / 60)}\n. Totais com horas bonus: \nHoras: ${Math.floor((this.totals.hours + this.totals.bonus) / 60)}\n`);
    }else{
      text = window.encodeURIComponent(`Olá ${this.elder} segue o meu relatório \nHoras: ${Math.floor(this.totals.hours / 60)}\nVídeos: ${this.totals.magazines}\nPublicações: ${this.totals.books}\nRevisitas: ${this.totals.revisits}\nEstudos: ${this.totals.studies} \n`);
    }
    window.open(`https://api.whatsapp.com/send?phone=55${this.elderNumber}&text=${text}`, "_blank");
  }
}
