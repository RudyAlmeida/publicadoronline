import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CongregationService } from 'src/app/services/congregation.service';

@Component({
  selector: 'app-congregation',
  templateUrl: './congregation.component.html',
  styleUrls: ['./congregation.component.scss']
})
export class CongregationComponent implements OnInit {
  congregations: any = [];
  congregation: any = {
    firstName: 'Congregação',
    lastName: '',
    email: '',
    photoUrl: '../../../assets/img/logo.png'
  };

  @ViewChild('addCongregation', { static: true }) addCongregation!: TemplateRef<any>;
  constructor( private modal: NgbModal, private service: CongregationService ) { }

  ngOnInit(): void {
    this.service.getCongregations().then((res: any) => {
      this.congregations = res;
    })
  }

  saveCongregation(){
    this.service.addCongregation(this.congregation)
  }
  openSave(){
    this.modal.open(this.addCongregation, { size: 'lg' });
  }

}
