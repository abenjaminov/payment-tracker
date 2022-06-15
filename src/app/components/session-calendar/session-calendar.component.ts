import {Component} from "@angular/core";
import {dayNames, getMonths, Month, SessionDay} from "../../models";
import {Session, SessionPaymentState, SessionsService} from "../../services/sessions.service";
import {SessionEditorComponentService} from "../session-editor/session-editor.component.service";
import {Subscription} from "rxjs";
import {MessagePopupComponentService, MessagePopupType} from "../message-popup/message-popup.component.service";
import {SessionDayComponentService} from "../session-day/session-day.component.service";

@Component({
  selector: 'session-calendar',
  templateUrl: 'session-calendar.component.html',
  styleUrls: ['session-calendar.component.scss']
})
export class SessionCalendarComponent {

  month: number;
  year: number;

  dayNames = dayNames;
  SessionPaymentState = SessionPaymentState;

  sessionDays: Array<Array<SessionDay>> = [];

  nextMonth: Month;
  previousMonth: Month;
  currentMonth: Month;
  months: Array<Month>;

  sessions: Array<Session>;
  isLoading: boolean;

  closeEditorSub: Subscription;

  constructor(private sessionService: SessionsService,
              private sessionEditorComponentService: SessionEditorComponentService,
              private messageService: MessagePopupComponentService,
              private sessionDayService: SessionDayComponentService) {
    this.closeEditorSub = this.sessionEditorComponentService.onCloseEditor.subscribe(() => {
      this.update();
    })
  }

  ngOnDestroy() {
    this.closeEditorSub.unsubscribe();
  }

  ngOnInit() {
    const today = new Date();
    this.init(today.getMonth(), today.getFullYear());
  }

  init(month, year) {
    this.month = month;
    this.year = year;
    this.months = getMonths(this.year);

    this.update();
  }

  setMonth() {
    this.currentMonth = this.months[this.month];

    this.nextMonth = this.months[this.currentMonth.nextMonth];
    this.previousMonth = this.months[this.currentMonth.previousMonth];
  }

  onSessionClicked(sessionDay: SessionDay, session: Session) {
    this.sessionService.showSessionEditor({
      session: session,
      sessionDay: sessionDay
    })
  }

  onAddSessionClicked(day: SessionDay) {
    this.sessionEditorComponentService.showEditor({
      sessionDay: day
    })
  }

  getSessionsForDate(year: number, month: number, date: number) {
    const sessions = this.sessions.filter(session => session.date.getMonth() == month &&
                                          session.date.getDate() == date &&
                                          session.date.getFullYear() == year).
    sort((a,b) => {
      let result = a.date > b.date ? 1 : -1;
      return result;
    })

    return sessions;
  }

  async updateSessions() {
    this.isLoading = true;

    this.sessions = await this.sessionService.getAllSessions({
      filterMonth: this.month
    })

    for (let i = 0; i < this.sessionDays.length; i++) {
      for(let j = 0; j < this.sessionDays[i].length; j++) {
        const day = this.sessionDays[i][j];
        day.sessions = this.getSessionsForDate(day.year, day.month, day.date);
        day.firstThreeSessions = day.sessions.slice(0,3);
      }
    }

    this.isLoading = false;
  }

  async update() {
    this.setMonth();
    let currentDate = new Date();

    let date = 0;

    this.sessionDays = [];

    // Week 1
    this.sessionDays.push([]);

    for (let i = 0; i < 7; i++) {
      const isPreviousMonth = i < this.currentMonth.firstDayOfTheMonth;
      date = isPreviousMonth ? date : date + 1;

      const year = isPreviousMonth ? this.currentMonth.previousMonthYear : this.currentMonth.year;
      const month = isPreviousMonth ? this.currentMonth.previousMonth : this.currentMonth.month;
      const isToday = year == currentDate.getFullYear() && month == currentDate.getMonth() && date == currentDate.getDate();

      this.sessionDays[0].push({
        year,
        month,
        day: i,
        isToday,
        isNotDisplayedMonth: isPreviousMonth,
        date : isPreviousMonth ? (this.previousMonth.numberOfDays - (this.currentMonth.firstDayOfTheMonth - (i + 1))) : date
      });
    }

    for (let i = 1; i <= 3; i++) {
      this.sessionDays.push([]);

      for (let j = 0; j < 7; j++) {
        date++;

        const year = this.year;
        const month = this.month;
        const isToday = year == currentDate.getFullYear() && month == currentDate.getMonth() && date == currentDate.getDate();

        this.sessionDays[i].push({
          year,
          month,
          day: j,
          isToday,
          isNotDisplayedMonth: false,
          date
        });
      }
    }

    // Week 5
    this.sessionDays.push([]);
    for (let i = 0; i < 7; i++) {
      const isNextMonth = i > this.currentMonth.lastDayOfTheMonth;
      date = isNextMonth ? date : date + 1;

      const year = isNextMonth ? this.currentMonth.nextMonthYear : this.currentMonth.year;
      const month = isNextMonth ? this.currentMonth.nextMonth : this.currentMonth.month;
      const isToday = year == currentDate.getFullYear() && month == currentDate.getMonth() && date == currentDate.getDate();

      this.sessionDays[4].push({
        year,
        month,
        day: i,
        isToday,
        isNotDisplayedMonth: i > this.currentMonth.lastDayOfTheMonth,
        date : isNextMonth ? (i - this.currentMonth.lastDayOfTheMonth) : date
      });
    }

    await this.updateSessions();
  }

  onPreviousMonthClicked() {
    const month = this.currentMonth.previousMonth;
    const year = this.currentMonth.previousMonthYear;

    this.init(month, year);
  }

  onNextMonthClicked() {
    const month = this.currentMonth.nextMonth;
    const year = this.currentMonth.nextMonthYear;

    this.init(month, year);
  }

  onMoreClicked(sessionDay) {
    this.sessionDayService.showEditor({
      sessionDay
    })
  }
}
