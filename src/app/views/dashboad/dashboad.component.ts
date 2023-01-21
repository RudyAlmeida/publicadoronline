import { SocialAuthService } from '@abacritt/angularx-social-login';
import { Component, OnChanges, OnInit, SimpleChange, SimpleChanges } from '@angular/core';
import { CalendarEvent, CalendarDateFormatter, DAYS_OF_WEEK, } from 'angular-calendar';
import { ChangeDetectionStrategy, ViewChild, TemplateRef } from '@angular/core';
import { startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours, setHours, setMinutes } from 'date-fns';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CalendarEventAction, CalendarEventTimesChangedEvent, CalendarView } from 'angular-calendar';
import { EventColor } from 'calendar-utils';
import { CustomDateFormatter } from '../../custom-date-formatter.provider';
import { ToastrService } from 'ngx-toastr';
import { RegistriesService } from 'src/app/services/registries.service';
import { FileService } from 'src/app/services/files.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';


const colors: Record<string, EventColor> = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
};

@Component({
  selector: 'app-dashboad',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      h3 {
        margin: 0 0 10px;
      }

      pre {
        background-color: #f5f5f5;
        padding: 15px;
      }
    `,
  ],
  providers: [
    {
      provide: CalendarDateFormatter,
      useClass: CustomDateFormatter,
    },
  ],
  templateUrl: './dashboad.component.html',
  styleUrls: ['./dashboad.component.scss']
})
export class DashboadComponent implements OnInit, OnChanges {
  @ViewChild('modalContent', { static: true }) modalContent!: TemplateRef<any>;
  @ViewChild('modalDelete', { static: true }) modalDelete!: TemplateRef<any>;
  @ViewChild('modalWhatsapp', { static: true }) modalWhatsapp!: TemplateRef<any>;
  @ViewChild('modalNewRevisit', { static: true }) modalNewRevisit!: TemplateRef<any>;
  @ViewChild('modalListRevisits', { static: true }) modalListRevisits!: TemplateRef<any>;
  @ViewChild('modalEditRevisit', { static: true }) modalEditRevisit!: TemplateRef<any>;

  publicador: any = []

  locale: string = 'pt';

  saveButton: boolean = true
  view: CalendarView = CalendarView.Day;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  modalData!: {
    oficialDay?: Date
    startHour?: string;
    startMinute?: string;
    endHour?: string;
    endMinute?: string;
    magazines?: number;
    books?: number;
    revisits?: number;
    studies?: number
  };
  newRevisit!: {
    id?: String,
    publisher?: String
    revistName?: String,
    bestDay?: String,
    imagem?: String,
    firstVisitDay?: number,
    firstVisitMonth?: number,
    firstVisitYear?: number,
    phone?: String,
    email?: String,
    street?: String,
    number?: String,
    neighborhood?: String,
    reference?: String,
    publication?: String,
    isActiveStudy?: String,
    comments?: any[]
  }
  editingRevist!: any
  comment!: String
  allRevists: any = []
  myRevisits: any = []
  actions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-fw fa-pencil-alt"></i>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      },
    },
    {
      label: '<i class="fas fa-fw fa-trash-alt"></i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter((iEvent) => iEvent !== event);
        this.handleEvent('Deleted', event);
      },
    },
  ];

  refresh = new Subject<void>();

  events: CalendarEvent[] = [];
  totals: any = {
    email: '',
    hours: 0,
    magazines: 0,
    books: 0,
    revisits: 0,
    //studies: 0
  };
  minutes: number = 0

  activeDayIsOpen: boolean = true;
  deleteButton: boolean = false
  sendRegistryButton: boolean = false

  editingEvent: CalendarEvent = {
    start: this.viewDate,
    title: ''
  };

  elder: string = '';
  elderNumber: string = '';
  sendWhatsapp: boolean = true;
  lastDay: number = 30;
  today: number = new Date().getDate()
  minutesArray: any [] = []
  meses: String[] = [  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']; 
  diasDaSemana: String[] = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
  spinner: boolean = false
  spinnerEdit: boolean = false

  constructor(private authService: SocialAuthService, private modal: NgbModal, private toastr: ToastrService, private service: RegistriesService, private fileService: FileService ) { }

  ngOnInit(): void {
    let user = localStorage.getItem('publicador')
    this.publicador = user ? JSON.parse(user) : []
    console.log(this.publicador)
    this.publicador.perfil == undefined ? this.publicador.perfil = 'publicador' : this.publicador.perfil;
    this.totals.email = this.publicador.email;
    this.getTotals()
    this.getEvents()
    for(let i = 0; i <= 59; i++){
      let minute = {'value' : i.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false}), 'title' : i.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})}
      this.minutesArray.push(minute)
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["events"]) {
      this.events = [...this.events]
    }
  }
  getTotals() {
    let totalCollectionName: string = `totals-${this.viewDate.getMonth().toString()}-${this.viewDate.getFullYear().toString()}`
    this.lastDay = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth() + 1, 0).getDate()

    this.service.getTotals(totalCollectionName, this.publicador.email).then((result: any) => { this.totals = result.length == 0 ? this.totals = { email: this.publicador.email, hours: 0, magazines: 0, books: 0, revisits: 0, studies: 0 } : result[0] }).finally(() => this.refresh.next())
  }
  getEvents() {
    this.events = [];
    let collectionName: string = this.viewDate.getMonth().toString() + this.viewDate.getFullYear().toString()
    let day = this.viewDate.getDate()
    this.service.getRegistriesFromDayByPublisher(collectionName, this.publicador.email, day).then((result: any) => {
      result.forEach((element: any) => {
        element.start = new Date(element.start)
        element.end = new Date(element.end)
        element.action = this.actions
        this.events.push(element)
      })
    }).finally(() => {
      let lastDayOfMonth = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth() + 1, 0);
      this.viewDate.toDateString() == lastDayOfMonth.toDateString() ? this.sendRegistryButton = true : this.sendRegistryButton = false;
      this.getTotals();
      this.refresh.next();
    })
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.editingEvent = { ...event }
    this.modalData = { ...event.meta };
    this.checkHour()
    if (this.editingEvent.id || this.editingEvent.id != "") {
      this.deleteButton = true;
    }

    this.modal.open(this.modalContent, { size: 'lg' });
  }

  addEvent(): void {
    this.events = [
      ...this.events,
      {
        title: 'New event',
        start: startOfDay(new Date()),
        end: endOfDay(new Date()),
        color: colors["red"],
        meta: {
          ...this.modalData
        }
      },
    ];
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter((event) => event.id !== eventToDelete.id);
  }
  openDeleteModal() {
    this.modal.open(this.modalDelete, { size: 'lg' });
  }
  deleteFromDb() {
    let collectionName: string = this.viewDate.getMonth().toString() + this.viewDate.getFullYear().toString();
    let totalCollectionName: string = `totals-${this.viewDate.getMonth().toString()}-${this.viewDate.getFullYear().toString()}`;

    let deleteHour: number = 0;
    if (this.editingEvent.meta.endHour && this.editingEvent.meta.startHour && this.editingEvent.meta.endMinute && this.editingEvent.meta.startMinute) {
      deleteHour = ((Number(this.editingEvent.meta.endHour) * 60) + Number(this.editingEvent.meta.endMinute)) - ((Number(this.editingEvent.meta.startHour) * 60) + Number(this.editingEvent.meta.startMinute));
    }
    this.totals.hours -= (deleteHour);
    this.totals.magazines -= this.editingEvent.meta.magazines;
    this.totals.books -= this.editingEvent.meta.books;
    this.totals.revisits -= this.editingEvent.meta.revisits;
    this.totals.studies -= this.editingEvent.meta.studies;
    this.service.deleteRegistry(this.editingEvent, collectionName)
    this.service.addAndUpdateTime(this.totals, totalCollectionName).finally(() => {
      this.getTotals();
    });
    this.deleteEvent(this.editingEvent)
    this.modal.dismissAll();

  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }
  hourSegmentClicked() {
    this.modalData = {
      oficialDay: this.viewDate,
      startHour: "00",
      startMinute: "00",
      endHour: "00",
      endMinute: "00",
      magazines: 0,
      books: 0,
      revisits: 0,
      //studies: 0
    }
    if (this.editingEvent != undefined) {
      this.editingEvent.id = ""
      this.deleteButton = false;
    }
    this.modal.open(this.modalContent, { size: 'lg' });
  }
  saveRegistry() {

    let hour: number = 0;
    if (this.modalData.endHour && this.modalData.startHour && this.modalData.endMinute && this.modalData.startMinute) {
      hour = ((Number(this.modalData.endHour) * 60) + Number(this.modalData.endMinute)) - ((Number(this.modalData.startHour) * 60) + Number(this.modalData.startMinute));
    }
    let event: CalendarEvent = {
      start: setHours(setMinutes(new Date(this.viewDate), Number(this.modalData.startMinute)), Number(this.modalData.startHour)),
      end: setHours(setMinutes(new Date(this.viewDate), Number(this.modalData.endMinute)), Number(this.modalData.endHour)),
      title: `Horas: ${Math.floor(hour / 60)}, Minutos: ${hour % 60}, Revistas: ${this.modalData.magazines}, Publicações: ${this.modalData.books}, Revisitas: ${this.modalData.revisits}.`,
      color: { ...colors['yellow'] },
      meta: {
        day: this.viewDate.getDate(),
        publisher: this.publicador.email,
        ...this.modalData
      }
    }


    let collectionName: string = this.viewDate.getMonth().toString() + this.viewDate.getFullYear().toString();
    let totalCollectionName: string = `totals-${this.viewDate.getMonth().toString()}-${this.viewDate.getFullYear().toString()}`;

    if (this.editingEvent.id === undefined || this.editingEvent.id == '') {
      this.service.addRegistry(event, collectionName)
      this.totals.hours += (hour);
      this.totals.magazines += this.modalData.magazines;
      this.totals.books += this.modalData.books;
      this.totals.revisits += this.modalData.revisits;
      //this.totals.studies += this.modalData.studies;
    } else {
      let editingHour: number = 0;
      if (this.editingEvent.meta.endHour && this.editingEvent.meta.startHour && this.editingEvent.meta.endMinute && this.editingEvent.meta.startMinute) {
        editingHour = ((Number(this.editingEvent.meta.endHour) * 60) + Number(this.editingEvent.meta.endMinute)) - ((Number(this.editingEvent.meta.startHour) * 60) + Number(this.editingEvent.meta.startMinute));
      }
      event.id = this.editingEvent.id
      this.deleteEvent(this.editingEvent)
      editingHour <= hour ? this.totals.hours += (hour - editingHour) : this.totals.hours -= (editingHour - hour)
      this.editingEvent.meta.magazines <= (this.modalData.magazines as number) ? this.totals.magazines += (this.modalData.magazines as number - this.editingEvent.meta.magazines) : this.totals.magazines -= (this.editingEvent.meta.magazines - (this.modalData.magazines as number))
      this.editingEvent.meta.books <= (this.modalData.books as number) ? this.totals.books += (this.modalData.books as number - this.editingEvent.meta.books) : this.totals.books -= (this.editingEvent.meta.books - (this.modalData.books as number));
      this.editingEvent.meta.revisits <= (this.modalData.revisits as number) ? this.totals.revisits += (this.modalData.revisits as number - this.editingEvent.meta.revisits) : this.totals.revisits -= (this.editingEvent.meta.revisits - (this.modalData.revisits as number))
      //this.editingEvent.meta.studies <= (this.modalData.studies as number) ? this.totals.studies += (this.modalData.studies as number - this.editingEvent.meta.studies) : this.totals.studies -= (this.editingEvent.meta.studies - (this.modalData.studies as number))
      this.service.editRegistry(event, collectionName)
    }
    this.service.addAndUpdateTime(this.totals, totalCollectionName).finally(() => {
      this.getTotals();
    });
    this.getEvents();

    this.modal.dismissAll();
  }

  checkHour() {
    if (this.modalData.endHour != undefined && this.modalData.startHour != undefined) {
      if ((this.modalData.endHour + this.modalData.endMinute) < (this.modalData.startHour + this.modalData.startMinute)) {
        this.toastr.error('Hora de encerramento não pode ser menor que a de inicio.', 'ERRO', {
          timeOut: 5000,
        });
      } else {
        this.saveButton = false;
      }
    }
  }
  checkWhatsapp(){
    this.sendWhatsapp =  this.elder.length >= 3 && this. elderNumber.toString().length >= 10 ? false : true;
  }
  openWhatsappModal() {
    this.modal.open(this.modalWhatsapp, { size: 'lg' });
  }
  sendRegistry() {
    let text = window.encodeURIComponent(`Olá ${this.elder} segue o meu relatório \nHoras: ${Math.floor(this.totals.hours / 60)}\nMinutos: ${this.totals.hours % 60}\nRevistas: ${this.totals.magazines}\nPublicações: ${this.totals.books}\nRevisitas: ${this.totals.revisits}\nEstudos: ${this.totals.studies}`);
    window.open(`https://api.whatsapp.com/send?phone=55${this.elderNumber}&text=${text}`, "_blank");
  }
  changePerfil(){
    setTimeout(()=>{
      localStorage.setItem('publicador', JSON.stringify(this.publicador));
    },500)
  }
  openRevisitModal(){
    this.modal.open(this.modalNewRevisit, { size: 'lg' });
    this.newRevisit = {
      publisher: this.publicador.email,
      revistName: "",
      firstVisitDay: this.viewDate.getDate(),
      firstVisitMonth: this.viewDate.getMonth(),
      firstVisitYear: this.viewDate.getFullYear(),
      street: "",
      number: "",
      neighborhood: "",
      reference: "",
      publication: "",
      isActiveStudy: "",
      comments: []
    }
    this.comment = ''
  }
  saveNewRevisit(){
    this.newRevisit.comments?.push({day: this.viewDate.getDate(), month: this.viewDate.getMonth(), comment: this.comment })
    this.service.addRevisit(this.newRevisit).then(result => console.log(result))
    this.modal.dismissAll();
  }
  openListRevisitModal(){
    this.modal.open(this.modalListRevisits, { size: 'lg' });
    this.service.getRevisits(this.publicador.email).then(result => {this.allRevists = result, this.myRevisits = [...this.allRevists]} )
    
  }
  filterStudentes(type: String){
    this.myRevisits = type == "true" ? this.allRevists.filter((student : any) => student.isActiveStudy ==="true" ) :  type == "false" ? this.allRevists.filter((student : any) => student.isActiveStudy ==="false" ) : [...this.allRevists]
  }
  openEditRevisitModal(revist: any){
    this.comment = ''
    this.editingRevist = revist
    this.modal.open(this.modalEditRevisit, { size: 'lg' });
  }
  EditRevisit(){
    this.service.editRevist(this.editingRevist)
  }
  newComment(){
    this.editingRevist.comments?.push({day: this.viewDate.getDate(), month: this.viewDate.getMonth(), comment: this.comment })
    this.service.editRevist(this.editingRevist).then(()=>this.comment = '')
  }

  uploadFile(event: any) {
    this.spinner = true;
    const file = event.target.files[0];

    let reader = new FileReader()
    let nome = "imagem"
    reader.readAsDataURL(file)
    reader.onloadend = () =>{
      console.log(reader.result)
      this.fileService.uploadFile(`${this.publicador.firstName + this.publicador.lastName}`, nome+Date.now(), reader.result).then(
        (urlImagem: any) =>{
          this.newRevisit.imagem = urlImagem
          this.spinner = false;
        }
      )
    }
  }
  uploadFileEdit(event: any) {
    this.spinnerEdit = true;
    const file = event.target.files[0];

    let reader = new FileReader()
    let nome = "imagem"
    reader.readAsDataURL(file)
    reader.onloadend = () =>{
      console.log(reader.result)
      this.fileService.uploadFile(`${this.publicador.firstName + this.publicador.lastName}`, nome+Date.now(), reader.result).then(
        (urlImagem: any) =>{
          this.editingRevist.imagem = urlImagem
          this.spinnerEdit = false;
        }
      )
    }
  }
}


