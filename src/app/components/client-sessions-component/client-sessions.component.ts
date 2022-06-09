import {Component, Input} from "@angular/core";
import {ClientService} from "../../services/client.service";
import {Session, SessionPaymentState, SessionsService} from "../../services/sessions.service";
import {MessagePopupComponentService, MessagePopupType} from "../message-popup/message-popup.component.service";
import {systemMessages} from "../../../messages";
import {PagedEntityNames, PagingComponentService} from "../paging/paging.component.service";

@Component({
  selector: 'client-sessions',
  templateUrl: 'client-sessions.component.html',
  styleUrls: ['client-sessions.component.scss'],
  providers: [PagingComponentService]
})
export class ClientSessionsComponent {
  @Input() clientAirTableId: string;
  @Input() title: string;

  loadingSessionIds: {[key: string] : boolean} = {};
  isLoading: boolean;
  SessionPaymentState = SessionPaymentState;
  sessions: Array<Session>;
  sessionToAdd: Session;

  editedSessionId: string;


  constructor(public clientService: ClientService, private pagingService: PagingComponentService,
              public sessionsService: SessionsService, private messageService: MessagePopupComponentService) {

    pagingService.onPageChange.subscribe(async () => {
      this.isLoading = true;
      await this.init();
      this.isLoading = false;
    })
  }

  async ngOnInit() {
    await this.init();
  }

  async init() {
    await this.clientService.loadClient(this.clientAirTableId);

    this.initSessionToAdd()

    await this.pagingService.load(PagedEntityNames.clients, 15);

    this.sessions = await this.sessionsService.getSessions({filterClientId: this.clientService.selectedClient.id});
  }

  initSessionToAdd() {
    if(!this.clientService.selectedClient) return;

    this.sessionToAdd = {
      date: new Date(Date.now()),
      paymentState: SessionPaymentState.owed,
      clientIdRef: [this.clientService.selectedClient.airTableId],
      payment: this.clientService.selectedClient.basePayment
    }
  }

  async onToggleSessionState(session: Session) {
    this.isLoading = true;
    this.sessionsService.toggleSessionPaymentState(session);
    await this.sessionsService.saveSession(session)

    await this.init();
    this.isLoading = false;
  }

  onSessionToAddDateChanged(session:Session, $event) {
    session.date = new Date($event)
  }

  onSessionToAddDatePayedChanged(session:Session, $event) {
    session.datePayed = new Date($event)
  }

  async onAddSessionClicked() {
    this.isLoading = true;
    await this.sessionsService.addSession(this.sessionToAdd)

    await this.init();
    this.isLoading = false;
  }

  async onDeleteSessionClicked(session: Session) {
    this.loadingSessionIds[session.airTableId] = true
    await this.sessionsService.deleteSession(session);

    await this.init();
    this.loadingSessionIds[session.airTableId] = false
  }

  onEditSessionClicked(session: Session) {
    if(!this.editedSessionId) {
      this.editedSessionId = session.airTableId;
    }
    else {
      this.messageService.showMessage({
        title: systemMessages.alreadyEditingTitle,
        message: systemMessages.alreadyEditingMessage,
        type: MessagePopupType.info,
        actions: [{
          text: 'ביטול',
          isClose: true,
          action: () => {
            this.editedSessionId = session.airTableId;
          }
        },{
          text: 'שמירה',
          isPrimary: true,
          action : async () => {
            this.messageService.closeMessage();
            const editedSession = this.sessions.find((s) => s.airTableId == this.editedSessionId)
            await this.onSaveSessionClicked(editedSession)

            this.editedSessionId = session.airTableId;
          }
        }]
      })
    }
  }

  async onSaveSessionClicked(session: Session) {
    this.editedSessionId = undefined;
    this.loadingSessionIds[session.airTableId] = true;
    setTimeout(async () => {
      await this.sessionsService.saveSession(session);

      //await this.init();
      this.loadingSessionIds[session.airTableId] = false;
    })
  }
}
