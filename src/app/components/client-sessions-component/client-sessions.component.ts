import {Component, ElementRef, Input, ViewChild} from "@angular/core";
import {ClientService} from "../../services/client.service";
import {Session, SessionPaymentState, SessionsService} from "../../services/sessions.service";

@Component({
  selector: 'sessions',
  templateUrl: 'sessions.component.html',
  styleUrls: ['sessions.component.scss']
})
export class SessionsComponent {
  @Input() clientId: string;
  @Input() title: string;

  SessionPaymentState = SessionPaymentState;
  sessions: Array<Session>;
  sessionToAdd: Session;

  editedSessionId: number;

  constructor(public clientService: ClientService, public sessionsService: SessionsService) {
  }

  async ngOnInit() {
    await this.init();
  }

  async init() {
    this.initSessionToAdd()

    await this.clientService.loadClient(this.clientId);
    this.sessions = await this.sessionsService.getSessions(this.clientId);
  }

  initSessionToAdd() {
    if(!this.clientService.selectedClient) return;

    this.sessionToAdd = {
      date: new Date(Date.now()),
      paymentState: SessionPaymentState.owed,
      clientId: this.clientId,
      payment: this.clientService.selectedClient.basePayment
    }
  }

  OnToggleSessionState(session: Session) {
    this.sessionsService.toggleSessionPaymentState(session);
  }

  onSessionToAddDateChanged(session:Session, $event) {
    session.date = new Date($event)
  }

  async onAddSessionClicked() {
    await this.sessionsService.addSession(this.sessionToAdd)

    await this.init();
  }

  async onDeleteSessionClicked(session: Session) {
    await this.sessionsService.deleteSession(session);

    await this.init();
  }

  onEditSessionClicked(session: Session) {
    if(this.editedSessionId) {
      // TODO : ask
    }

    this.editedSessionId = session.id;
  }

  onSaveSessionClicked(session: Session) {
    this.editedSessionId = undefined;
  }
}
