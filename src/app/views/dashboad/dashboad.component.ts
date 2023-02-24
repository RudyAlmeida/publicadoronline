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
  @ViewChild('modalImagem', { static: true }) modalImagem!: TemplateRef<any>;
  @ViewChild('modalVideo', { static: true }) modalVideo!: TemplateRef<any>;

  publicador: any = []

  locale: string = 'pt';

  saveButton: boolean = true;
  view: CalendarView = CalendarView.Month;

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
    studies?: number;
    bonus?: String
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
  };
  editingRevist!: any;
  comment!: String;
  edittingComment!: any;
  isEdittingComment: boolean = false;
  edittingId: number = 0;
  allRevists: any = [];
  myRevisits: any = [];
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
  dayEvents: CalendarEvent[] = [];

  totals: any = {
    email: '',
    hours: 0,
    bonus: 0,
    total: 0,
    magazines: 0,
    books: 0,
    revisits: 0,
    studies: 0
  };
  minutes: number = 0;

  activeDayIsOpen: boolean = true;
  deleteButton: boolean = false;
  sendRegistryButton: boolean = false;

  editingEvent: CalendarEvent = {
    start: this.viewDate,
    title: ''
  };

  elder: string = '';
  elderNumber: string = '';
  sendWhatsapp: boolean = true;
  lastDay: number = 30;
  today: number = new Date().getDate()
  minutesArray: any[] = []
  meses: String[] = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  diasDaSemana: String[] = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
  spinner: boolean = false;
  spinnerEdit: boolean = false;


  videoItems = [
    {
      name: 'Video one',
      src: 'https://firebasestorage.googleapis.com/v0/b/publicador-online.appspot.com/o/video-aparesenta%C3%A7%C3%A3o%2Funknown_2023.01.22-23.55.mp4?alt=media&token=08cd4cb4-686e-41c7-a0d7-edca3a91bcef',
      type: 'video/mp4'
    }
  ];
  activeIndex = 0;
  currentVideo = this.videoItems[this.activeIndex];
  data: any;

  constructor(private authService: SocialAuthService, private modal: NgbModal, private toastr: ToastrService, private service: RegistriesService, private fileService: FileService) { }

  ngOnInit(): void {
    let user = localStorage.getItem('publicador')
    this.publicador = user ? JSON.parse(user) : []
    this.publicador.perfil == undefined ? this.publicador.perfil = 'publicador' : this.publicador.perfil;
    this.totals.email = this.publicador.email;
    this.getTotals()
    this.getEvents()
    for (let i = 0; i <= 59; i++) {
      let minute = { 'value': i.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false }), 'title': i.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false }) }
      this.minutesArray.push(minute)
    }
    if (this.publicador.showVideo == "true") {
      this.modal.open(this.modalVideo, { size: 'lg' });
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

    this.service.getTotals(totalCollectionName, this.publicador.email).then((result: any) => { this.totals = result.length == 0 ? this.totals = { email: this.publicador.email, hours: 0, bonus: 0, magazines: 0, books: 0, revisits: 0, studies: 0 } : result[0] }).finally(() => this.refresh.next())
  }
  getEvents() {
    this.events = [];
    let collectionName: string = this.viewDate.getMonth().toString() + this.viewDate.getFullYear().toString()
    let day = this.viewDate.getDate()

    this.service.getRegistriesFromPublisher(collectionName, this.publicador.email).then((result: any) => {
      result.forEach((element: any) => {
        element.start = new Date(element.start)
        element.end = new Date(element.end)
        element.action = this.actions
        this.events.push(element)
      })
    }).finally(() => {
      this.events = [...this.events]
      this.dayEvents = this.events.filter((registry: any) => registry.meta.day === day);
      this.refresh.next()
    })
  }

  getDayEvents() {
    let day = this.viewDate.getDate()
    this.dayEvents = this.events.filter((registry: any) => registry.meta.day === day);
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
      this.hourSegmentClicked()
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
    this.editingEvent.meta.bonus == "true" ? this.totals.bonus -= (deleteHour) : this.totals.hours -= (deleteHour)
    this.totals.magazines -= this.editingEvent.meta.magazines;
    this.totals.books -= this.editingEvent.meta.books;
    this.totals.revisits -= this.editingEvent.meta.revisits;
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
    this.getDayEvents()
  }

  setDate(date: Date) {
    this.viewDate = date
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
      bonus: "false"
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



    let collectionName: string = this.viewDate.getMonth().toString() + this.viewDate.getFullYear().toString();
    let totalCollectionName: string = `totals-${this.viewDate.getMonth().toString()}-${this.viewDate.getFullYear().toString()}`;
    let bonus = this.modalData.bonus == "true" ? "Sim" : "Não"
    if (this.editingEvent.id === undefined || this.editingEvent.id == '') {
      let event: CalendarEvent = {
        start: setHours(setMinutes(new Date(this.viewDate), Number(this.modalData.startMinute)), Number(this.modalData.startHour)),
        end: setHours(setMinutes(new Date(this.viewDate), Number(this.modalData.endMinute)), Number(this.modalData.endHour)),
        title: `Horas: ${Math.floor(hour / 60)}, Minutos: ${hour % 60}, Revistas: ${this.modalData.magazines}, Publicações: ${this.modalData.books}, Revisitas: ${this.modalData.revisits}, Bonus: ${bonus}.`,
        color: { ...colors['yellow'] },
        meta: {
          day: this.viewDate.getDate(),
          publisher: this.publicador.email,
          ...this.modalData
        }
      }
      this.service.addRegistry(event, collectionName)
      this.modalData.bonus == "true" ? this.totals.bonus += (hour) : this.totals.hours += (hour);
      this.totals.magazines += this.modalData.magazines;
      this.totals.books += this.modalData.books;
      this.totals.revisits += this.modalData.revisits;
    } else {
      let editingHour: number = 0;
      if (this.editingEvent.meta.endHour && this.editingEvent.meta.startHour && this.editingEvent.meta.endMinute && this.editingEvent.meta.startMinute) {
        editingHour = ((Number(this.editingEvent.meta.endHour) * 60) + Number(this.editingEvent.meta.endMinute)) - ((Number(this.editingEvent.meta.startHour) * 60) + Number(this.editingEvent.meta.startMinute));
      }
      let event: CalendarEvent = {
        start: this.editingEvent.start,
        end: this.editingEvent.end,
        title: `Horas: ${Math.floor(hour / 60)}, Minutos: ${hour % 60}, Revistas: ${this.modalData.magazines}, Publicações: ${this.modalData.books}, Revisitas: ${this.modalData.revisits},  Bonus: ${bonus}..`,
        color: { ...colors['yellow'] },
        meta: {
          day: this.viewDate.getDate(),
          publisher: this.publicador.email,
          ...this.modalData
        }
      }
      event.id = this.editingEvent.id
      this.deleteEvent(this.editingEvent)
      if (this.modalData.bonus == this.editingEvent.meta.bonus) {
        if (this.modalData.bonus == "true") {
          editingHour <= hour ? this.totals.bonus += (hour - editingHour) : this.totals.bonus -= (editingHour - hour)
        } else {
          editingHour <= hour ? this.totals.hours += (hour - editingHour) : this.totals.hours -= (editingHour - hour)
        }
      } else {
        if (this.modalData.bonus == "true") {
          if (editingHour == hour) {
            this.totals.bonus += editingHour, this.totals.hours -= editingHour
          } else {              
              this.totals.bonus += hour
              this.totals.hours -= editingHour
          }
        } else {
          if (editingHour == hour) {
            this.totals.bonus -= editingHour, this.totals.hours += editingHour
          } else {
            if (editingHour > hour) {
              this.totals.hours += (editingHour - hour), this.totals.bonus -= editingHour
            } else {
              this.totals.hours += (hour - editingHour), this.totals.bonus -= editingHour
            }
          }
        }
      }
      this.editingEvent.meta.magazines <= (this.modalData.magazines as number) ? this.totals.magazines += (this.modalData.magazines as number - this.editingEvent.meta.magazines) : this.totals.magazines -= (this.editingEvent.meta.magazines - (this.modalData.magazines as number))
      this.editingEvent.meta.books <= (this.modalData.books as number) ? this.totals.books += (this.modalData.books as number - this.editingEvent.meta.books) : this.totals.books -= (this.editingEvent.meta.books - (this.modalData.books as number));
      this.editingEvent.meta.revisits <= (this.modalData.revisits as number) ? this.totals.revisits += (this.modalData.revisits as number - this.editingEvent.meta.revisits) : this.totals.revisits -= (this.editingEvent.meta.revisits - (this.modalData.revisits as number))
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
  checkWhatsapp() {
    this.sendWhatsapp = this.elder.length >= 3 && this.elderNumber.toString().length >= 10 ? false : true;
  }
  openWhatsappModal() {
    this.modal.open(this.modalWhatsapp, { size: 'lg' });
  }
  sendRegistry() {
    let text = window.encodeURIComponent(`Olá ${this.elder} segue o meu relatório \nHoras: ${Math.floor(this.totals.hours / 60)}\nMinutos: ${this.totals.hours % 60}\nRevistas: ${this.totals.magazines}\nPublicações: ${this.totals.books}\nRevisitas: ${this.totals.revisits}\nEstudos: ${this.totals.studies} Obs: Horas Bonus: \nHoras: ${Math.floor(this.totals.bonus / 60)}\nMinutos: ${this.totals.bonus % 60}\n. Totais com horas bonus: \nHoras: ${Math.floor((this.totals.hours + this.totals.bonus) / 60)}\nMinutos: ${(this.totals.hours + this.totals.bonus) % 60}\n`);
    window.open(`https://api.whatsapp.com/send?phone=55${this.elderNumber}&text=${text}`, "_blank");
  }
  changePerfil() {
    setTimeout(() => {
      localStorage.setItem('publicador', JSON.stringify(this.publicador));
    }, 500)
  }
  openRevisitModal() {
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
      isActiveStudy: "false",
      comments: []
    }
    this.comment = ''
  }
  saveNewRevisit() {
    this.newRevisit.comments?.push({ day: this.viewDate.getDate(), month: this.viewDate.getMonth(), comment: this.comment })
    this.service.addRevisit(this.newRevisit)
    this.modal.dismissAll();
  }
  openListRevisitModal() {
    this.modal.open(this.modalListRevisits, { size: 'lg' });
    this.service.getRevisits(this.publicador.email).then(result => { this.allRevists = result, this.myRevisits = [...this.allRevists] }).then(() => {
      let studies = this.allRevists.filter((student: any) => student.isActiveStudy === "true");
      if (studies.length != this.totals.studies) {
        this.totals.studies = studies.length;
        let totalCollectionName: string = `totals-${this.viewDate.getMonth().toString()}-${this.viewDate.getFullYear().toString()}`;
        this.service.addAndUpdateTime(this.totals, totalCollectionName).finally(() => {
          this.getTotals();
        });
      }
    })
  }
  filterStudentes(type: String) {
    this.myRevisits = type == "true" ? this.allRevists.filter((student: any) => student.isActiveStudy === "true") : type == "false" ? this.allRevists.filter((student: any) => student.isActiveStudy === "false") : [...this.allRevists]
  }
  openEditRevisitModal(revist: any) {
    this.comment = ''
    this.editingRevist = revist
    this.modal.open(this.modalEditRevisit, { size: 'lg' });
  }
  EditRevisit() {
    this.service.editRevist(this.editingRevist)
  }
  newComment() {
    this.editingRevist.comments?.push({ day: this.viewDate.getDate(), month: this.viewDate.getMonth(), comment: this.comment })
    this.service.editRevist(this.editingRevist).then(() => this.comment = '')
  }

  uploadFile(event: any) {
    this.spinner = true;
    const file = event.target.files[0];
    let reader = new FileReader()
    let nome = "imagem"
    reader.readAsDataURL(file)
    reader.onloadend = () => {
      this.fileService.uploadFile(`${this.publicador.firstName + this.publicador.lastName}`, nome + Date.now(), reader.result).then(
        (urlImagem: any) => {
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
    reader.onloadend = () => {
      this.fileService.uploadFile(`${this.publicador.firstName + this.publicador.lastName}`, nome + Date.now(), reader.result).then(
        (urlImagem: any) => {
          this.editingRevist.imagem = urlImagem
          this.spinnerEdit = false;
        }
      )
    }
  }
  updateStudies(isActive: String) {
    isActive == "true" ? this.totals.studies++ : this.totals.studies--;
    let totalCollectionName: string = `totals-${this.viewDate.getMonth().toString()}-${this.viewDate.getFullYear().toString()}`;
    this.service.addAndUpdateTime(this.totals, totalCollectionName).finally(() => {
      this.getTotals();
      this.service.editRevist(this.editingRevist);
    });
  }
  editComment(comment: any, id: number) {
    this.edittingComment = comment;
    this.edittingId = id;
    this.isEdittingComment = true
  }
  saveEditedComment() {
    this.editingRevist.comments[this.edittingId] = this.edittingComment;
    this.service.editRevist(this.editingRevist).then(() => {
      this.isEdittingComment = false;
    })
  }
  showImage() {
    this.modal.open(this.modalImagem, { size: 'lg' });
  }
  videoPlayerInit(data: any) {
    this.data = data;
    this.data.getDefaultMedia().subscriptions.loadedMetadata.subscribe(this.initVdo.bind(this));
    this.data.getDefaultMedia().subscriptions.ended.subscribe(this.nextVideo.bind(this));
  }
  nextVideo() {
    this.activeIndex++;
    if (this.activeIndex === this.videoItems.length) {
      this.activeIndex = 0;
    }
    this.currentVideo = this.videoItems[this.activeIndex];
  }
  initVdo() {
    this.data.play();
  }
  startPlaylistVdo(item: any, index: number) {
    this.activeIndex = index;
    this.currentVideo = item;
  }
  cancelVideo(action: String) {
    action == "true" ? this.publicador.showVideo = "true" : this.publicador.showVideo = "false";
    localStorage.setItem('publicador', JSON.stringify(this.publicador))
  }
  showVideo() {
    this.modal.open(this.modalVideo, { size: 'lg' });
  }

}


