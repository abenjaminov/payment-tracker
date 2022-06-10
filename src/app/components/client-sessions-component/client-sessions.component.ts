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

  isSessionSelected: {[key: string] : boolean} = {};

  sessionsMap: {[airTableId: string] : Session};

  isLoading: boolean;
  isAddingSession: boolean;
  SessionPaymentState = SessionPaymentState;
  sessions: Array<Session>;
  sessionToAdd: Session;

  editedSessionId: string;
  selectedCount: number = 0;


  constructor(public clientService: ClientService, private pagingService: PagingComponentService,
              public sessionsService: SessionsService, private messageService: MessagePopupComponentService) {

    pagingService.onPageChange.subscribe(async () => {
      this.isLoading = true;
      await this.init();
      this.isLoading = false;
    })
  }

  async ngOnInit() {
    this.isLoading = true;
    await this.init();
    this.isLoading = false;
  }

  async init() {
    await this.clientService.loadClient(this.clientAirTableId);

    this.initSessionToAdd()

    await this.pagingService.load(PagedEntityNames.clients, 15);

    this.sessions = await this.sessionsService.getSessions({filterClientId: this.clientService.selectedClient.id});

    this.sessionsMap = {};

    this.sessions.forEach((session) => {
      this.sessionsMap[session.airTableId] = session;
    });

    this.selectedCount = 0;
    this.isSessionSelected = {};
    this.loadingSessionIds = {};
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
    if(this.selectedCount > 0) {
      let keys = Object.keys(this.isSessionSelected).filter(x => this.isSessionSelected[x]);
      let isAllSameState = true;
      let firstState = this.sessionsMap[keys[0]].paymentState;

      for (let i = 1; i < keys.length && isAllSameState; i++) {
        isAllSameState = this.sessionsMap[keys[i]].paymentState === firstState;
      }

      if(!isAllSameState) {
        this.messageService.showMessage({
          title: 'שגיאה',
          message: 'יש לבחור רק אימונים אשר נמצאים באותו מצב תשלום לפני ביצוע פעולה זו.',
          type: MessagePopupType.error,
          actions: [{
            text: 'סגור',
            isClose: true,
            isPrimary: true
          }]
        })
      }
      else {
        const sessionsToEdit = keys.map(key => this.sessionsMap[key]);

        for (const sessionToEdit of sessionsToEdit) {
          this.loadingSessionIds[sessionToEdit.airTableId] = true;
          this.sessionsService.toggleSessionPaymentState(sessionToEdit);
        }

        setTimeout(async () => {
          await this.sessionsService.saveSession(sessionsToEdit)

          for (const sessionToEdit of sessionsToEdit) {
            this.loadingSessionIds[sessionToEdit.airTableId] = false;
          }
        })
      }
    }
    else {
      this.loadingSessionIds[session.airTableId] = true;
      this.sessionsService.toggleSessionPaymentState(session);
      setTimeout(async () => {
        await this.sessionsService.saveSession([session])

        this.loadingSessionIds[session.airTableId] = false;
      })
    }
  }

  onSessionToAddDateChanged(session:Session, $event) {
    session.date = new Date($event)
  }

  onSessionToAddDatePayedChanged(session:Session, $event) {
    session.datePayed = new Date($event)
  }

  async onAddSessionClicked() {
    this.isLoading = true;
    this.isAddingSession = true;
    await this.sessionsService.addSession(this.sessionToAdd)

    await this.init();
    this.isLoading = false;
    this.isAddingSession = false;
  }

  async onDeleteSessionClicked(session: Session) {
    if(this.isLoading || this.loadingSessionIds[session.airTableId]) return;

    let sessionsToDelete = [session];
    if(this.selectedCount > 0) {
      let keys = Object.keys(this.isSessionSelected).filter(x => this.isSessionSelected[x]);
      sessionsToDelete = keys.map(x => this.sessionsMap[x]);
    }

    this.messageService.showMessage({
      title: systemMessages.deleteMultipleClientSessionsTitle,
      message: systemMessages.deleteMultipleClientSessionsMessage,
      type: MessagePopupType.info,
      actions: [{
        text: "ביטול",
        isPrimary: true,
        isClose: true,
      },{
        text: "מחיקה",
        isClose: true,
        action : async () => {
          this.isLoading = true;
          let deletePromises = sessionsToDelete.map((x) => this.sessionsService.deleteMessageNoMessage(x));
          await Promise.all(deletePromises);

          await this.init();
          this.isLoading = false;
        }
      }]
    })
  }

  onEditSessionClicked(session: Session) {
    if(this.loadingSessionIds[session.airTableId] || this.selectedCount > 0) return;

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
      await this.sessionsService.saveSession([session]);

      this.loadingSessionIds[session.airTableId] = false;
    })
  }

  onSessionToggleSelected(session: Session) {
    this.isSessionSelected[session.airTableId] = !this.isSessionSelected[session.airTableId];

    if(this.isSessionSelected[session.airTableId]) {
      this.selectedCount++;
    }
    else{
      this.selectedCount--;
    }
  }
}
