import {Component} from "@angular/core";
import {SessionEditorArgs, SessionEditorComponentService} from "./session-editor.component.service";
import {Subscription} from "rxjs";
import {Session, SessionPaymentState, SessionsService} from "../../services/sessions.service";
import {Client, ClientService} from "../../services/client.service";

@Component({
  selector: 'session-editor',
  templateUrl: 'session-editor.component.html',
  styleUrls: ['session-editor.component.scss']
})
export class SessionEditorComponent {
  SessionPaymentState = SessionPaymentState;

  isOpen: boolean = false;
  isLoading: boolean = false;

  showSub: Subscription
  closeSub: Subscription;

  editedSession: Session;

  isCreate: boolean;
  title: string;

  clients: Array<Client>;
  selectedClientAirTableId: string;

  constructor(private sessionEditorComponentService: SessionEditorComponentService,
              private sessionService: SessionsService,
              public clientService: ClientService) {
    this.showSub = sessionEditorComponentService.onShowEditor.subscribe((args) => {
      this.showEditor(args);
    })

    this.closeSub = sessionEditorComponentService.onCloseEditor.subscribe(() => {
      this.isOpen = false;
    })
  }

  ngOnDestroy() {
    this.showSub.unsubscribe();
    this.closeSub.unsubscribe();
  }

  ngOnInit() {
  }

  async showEditor(sessionEditorArgs: SessionEditorArgs) {
    this.isOpen = true;
    this.editedSession = sessionEditorArgs.session;

    this.isCreate = this.editedSession == undefined;

    if(!this.isCreate) {
      this.title = `Session with ${this.editedSession.clientName} at ${this.editedSession.dateString}`;
    }
    else {
      this.title = "Create new session";
      this.editedSession = {
        date: new Date(sessionEditorArgs.sessionDay.year,sessionEditorArgs.sessionDay.month,sessionEditorArgs.sessionDay.date),
        paymentState: SessionPaymentState.owed
      }

      this.isLoading = true;
      await this.clientService.loadAllClients()
      this.isLoading = false;
    }
  }

  closeEditor() {
    this.sessionEditorComponentService.closeEditor();
  }

  onSessionDateChanged($event: any) {
    this.editedSession.date = new Date($event)
  }

  preventCloseEditor($event: MouseEvent) {
    $event.stopPropagation();
  }

  async onSaveSessionClicked() {
    if(this.isLoading) return;

    if(this.isCreate)
      this.editedSession.clientIdRef = [this.selectedClientAirTableId];

    this.isLoading = true;
    await this.sessionService.saveSession(this.editedSession)
    this.isLoading = false;

    this.closeEditor();
  }

  async onSelectedClientChanged($event) {
    this.selectedClientAirTableId = $event.target.value;
    const client = await this.clientService.getClientById(this.selectedClientAirTableId);
    this.editedSession.payment = client.basePayment;
  }

  async onDeleteSessionClicked() {
    this.isLoading = true;
    await this.sessionService.deleteSession(this.editedSession);
    this.isLoading = false

    this.closeEditor();
  }

  togglePaymentState() {
    this.editedSession.paymentState = this.editedSession.paymentState == SessionPaymentState.owed ? SessionPaymentState.payed : SessionPaymentState.owed;
  }
}
