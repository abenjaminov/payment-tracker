import {Component, Input} from "@angular/core";
import {Session, SessionPaymentState} from "../../services/sessions.service";

@Component({
  selector: 'session-summary',
  templateUrl: 'session-summary.component.html',
  styleUrls: ['session-summary.component.scss']
})
export class SessionSummaryComponent {
  SessionPaymentState = SessionPaymentState;

  @Input() session: Session;
}
