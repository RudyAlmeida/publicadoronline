import { Component, OnInit } from '@angular/core';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarView } from 'angular-calendar';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-school',
  templateUrl: './school.component.html',
  styleUrls: ['./school.component.scss']
})
export class SchoolComponent implements OnInit {
  view: CalendarView = CalendarView.Week;

  CalendarView = CalendarView;

  viewDate: Date = new Date();
  activeDayIsOpen: boolean = true;
  refresh = new Subject<void>();
  locale: string = 'pt';
  events: CalendarEvent[] = [];

  constructor() { }

  ngOnInit(): void {
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;

  }

  setView(view: CalendarView) {
    this.view = view;
  }

  setDate(date: Date) {
    this.viewDate = date
  }

  handleEvent(action: string, event: CalendarEvent): void {
    // this.editingEvent = { ...event }
    // this.modalData = { ...event.meta };
    // this.checkHour()
    // if (this.editingEvent.id || this.editingEvent.id != "") {
    //   this.deleteButton = true;
    // }

    // this.modal.open(this.modalContent, { size: 'lg' });
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

  hourSegmentClicked() {
/*     this.modalData = {
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
    this.modal.open(this.modalContent, { size: 'lg' }); */
  }

}
