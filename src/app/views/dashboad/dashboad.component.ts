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
    studies: 0
  };
  minutes: number = 0

  activeDayIsOpen: boolean = true;

  constructor(private authService: SocialAuthService, private modal: NgbModal, private toastr: ToastrService, private service: RegistriesService) { }

  ngOnInit(): void {
    let user = localStorage.getItem('publicador')
    this.publicador = user ? JSON.parse(user) : []
    this.totals.email = this.publicador.email;
    this.getTotals()
    this.getEvents()
    
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["events"]) {
      this.events = [...this.events]
    }
  }
  getTotals(){
    let totalCollectionName: string = `totals-${this.viewDate.getMonth().toString()}-${this.viewDate.getFullYear().toString()}`
    this.service.getTotals(totalCollectionName, this.publicador.email).then((result: any) => {this.totals = result.length == 0 ? this.totals : result[0]})
  }
  getEvents() {
    this.events = [];
    let collectionName: string = this.viewDate.getMonth().toString() + this.viewDate.getFullYear().toString()
    let day = this.viewDate.getDate()
    this.service.getRegistriesFromDayByPublisher(collectionName, this.publicador.email, day).then((result: any) => {
      result.forEach((element: any) => {
        element.start = new Date(element.start)
        element.end = new Date(element.end)
        this.events.push(element)
      })
    }).finally(() => {
        this.refresh.next()
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
    //this.modalData = { event, action };
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
    this.events = this.events.filter((event) => event !== eventToDelete);
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
      studies: 0
    }

    this.modal.open(this.modalContent, { size: 'lg' });
  }
  saveRegistry() {
    let hour: number = 0;
    if(this.modalData.endHour && this.modalData.startHour  && this.modalData.endMinute && this.modalData.startMinute){
      hour = ((Number(this.modalData.endHour) * 60) + Number(this.modalData.endMinute)) - ((Number(this.modalData.startHour) * 60) + Number(this.modalData.startMinute));
    }
    let event: CalendarEvent = {
      start: setHours(setMinutes(new Date(this.viewDate), Number(this.modalData.startMinute)), Number(this.modalData.startHour)),
      end: setHours(setMinutes(new Date(this.viewDate), Number(this.modalData.endMinute)), Number(this.modalData.endHour)),
      title: `Horas: ${Math.floor(hour/60)}, Minutos: ${hour%60}, Revistas: ${this.modalData.magazines}, Publicações: ${this.modalData.books}, Revisitas: ${this.modalData.revisits}, Estudos: ${this.modalData.studies},`,
      color: { ...colors['yellow'] },
      meta: {
        day: this.viewDate.getDate(),
        publisher: this.publicador.email,
        ...this.modalData
      }
    }
    this.events = [
      ...this.events,
      event
    ]

    let collectionName: string = this.viewDate.getMonth().toString() + this.viewDate.getFullYear().toString();

    let totalCollectionName: string = `totals-${this.viewDate.getMonth().toString()}-${this.viewDate.getFullYear().toString()}`;
    this.service.addRegistry(event, collectionName);
    this.totals.hours += (hour);
    this.totals.magazines += this.modalData.magazines;
    this.totals.books += this.modalData.books;
    this.totals.revisits += this.modalData.revisits;
    this.totals.studies += this.modalData.studies;
    this.service.addAndUpdateTime(this.totals, totalCollectionName).finally(() => {
      this.getTotals();
    });
    this.modal.dismissAll();
  }

  checkHour() {
    if (this.modalData.endHour != undefined && this.modalData.startHour != undefined) {
      if (this.modalData.endHour < this.modalData.startHour) {
        this.toastr.error('Hora de encerramento não pode ser menor que a de inicio.', 'ERRO', {
          timeOut: 5000,
        });
      } else {
        this.saveButton = false;
      }
    }
  }

}


