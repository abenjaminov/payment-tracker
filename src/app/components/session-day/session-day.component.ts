import {Component} from "@angular/core";
import {dayNames, monthNames, SessionDay} from "../../models";
import {SessionDayArgs, SessionDayComponentService} from "./session-day.component.service";
import {Subscription} from "rxjs";
import {Session, SessionsService} from "../../services/sessions.service";

@Component({
  selector: 'session-day',
  templateUrl: 'session-day.component.html',
  styleUrls: ['session-day.component.scss']
})
export class SessionDayComponent {
  sessionDay: SessionDay;
  isOpen: boolean;

  dayNames = dayNames;
  monthNames = monthNames;

  showSub: Subscription
  closeSub: Subscription;

  constructor(private service: SessionDayComponentService, private sessionService: SessionsService) {
    this.showSub = service.onShow.subscribe((args) => {
      this.show(args);
    })

    this.closeSub = service.onClose.subscribe(() => {
      this.closePopup();
    })
  }

  preventClosePopup($event: Event) {
    $event.stopPropagation();
  }

  ngOnDestroy() {
    if(this.showSub) this.showSub.unsubscribe();
    if(this.closeSub) this.closeSub.unsubscribe();
  }

  show(args: SessionDayArgs) {
    this.isOpen = true;
    this.sessionDay = args.sessionDay;
  }

  closePopup() {
    this.isOpen = false;
  }

  onSessionClicked(session: Session) {
    this.sessionService.showSessionEditor({
      session: session,
      sessionDay: this.sessionDay
    })
  }
}
