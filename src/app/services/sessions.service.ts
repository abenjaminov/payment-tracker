import {Injectable} from "@angular/core";
import {ApiService} from "./api.service";
import {AirTableEntity, GetPagedArgs} from "../models";
import {
  MessagePopupComponentService,
  MessagePopupType
} from "../components/message-popup/message-popup.component.service";
import {systemMessages} from "../../messages";
import dayjs from "dayjs";
import {
  SessionEditorArgs,
  SessionEditorComponentService
} from "../components/session-editor/session-editor.component.service";

export interface GetSessionArgs extends GetPagedArgs{
  filterClientId?: string;
  filterMonth?: number;
  filterPaymentMonth?: number;
  filterPaymentYear?: number;
  filterPaymentState?: SessionPaymentState
  filterText?: string;
}

export enum SessionPaymentStateServer {
  owed = 'owed',
  payed = 'payed'
}

export enum SessionPaymentState {
  owed,
  payed
}

export class Session implements AirTableEntity {
  airTableId?: string;

  id?: number;
  clientIdRef?: string[];
  payment?: number;
  date: Date;
  dateString?:string;
  timeString?: string;
  notes?:string;
  paymentState: SessionPaymentState;
  datePayed?: Date;
  datePayedString?: string;
  isFuture?: boolean;
  clientName?: string;
  receipt: boolean;
}

@Injectable({providedIn: 'root'})
export class SessionsService {

  constructor(private apiService: ApiService,
              private sessionEditorService: SessionEditorComponentService,
              private messageService: MessagePopupComponentService) {
  }

  showSessionEditor(args: SessionEditorArgs) {
    this.sessionEditorService.showEditor(args);
  }

  async saveSession(sessionsToEdit: Array<Session>) {
    await this.apiService.post('sessions', sessionsToEdit);
  }

  async deleteMessageNoMessage(sessionToDelete: Session) {
    await this.apiService.delete('sessions', sessionToDelete.airTableId);
  }

  deleteSession(sessionToDelete: Session) {
    return new Promise<void>((resolve, reject) => {
      const message = systemMessages.deleteSessionMessage.replace("{clientName}",sessionToDelete.clientName).replace("{sessionDate}",sessionToDelete.dateString);
      this.messageService.showMessage({
        title: systemMessages.deleteSessionTitle,
        message: message,
        type: MessagePopupType.info,
        actions: [{
          text: "ביטול",
          isPrimary: true,
          isClose: true,
          action: () => {
            resolve();
          }
        },{
          text: "מחיקה",
          action : async () => {
            this.messageService.closeMessage();
            await this.apiService.delete('sessions', sessionToDelete.airTableId);
            resolve();
          }
        }]
      })
    })
  }

  async addSession(sessionToAdd: Session) {
    await this.apiService.post('sessions', [sessionToAdd]);
  }

  async getSessions(filter?: GetSessionArgs) {
    const result = await this.apiService.get(`sessions`, filter)

    this.fixSessions(result);

    return result;
  }

  fixSessions(sessions: Array<Session>) {
    for(let session of sessions) {
      this.fixSession(session);
    }
  }

  fixSession(session: Session) {
    session.date = new Date(session.date);
    session.datePayed = session.datePayed ? new Date(session.datePayed) : undefined;
    const paymentState : any = SessionPaymentState[session.paymentState];
    session.paymentState = paymentState;

    this.prepForDisplay(session);
  }

  setPaymentState(session: Session, paymentState: SessionPaymentState) {
    if(paymentState == SessionPaymentState.owed) {
      session.paymentState = SessionPaymentState.owed;
      session.datePayed = undefined;
    }
    else if(paymentState == SessionPaymentState.payed) {
      session.paymentState = SessionPaymentState.payed;
      session.datePayed = new Date();
    }
  }

  toggleSessionPaymentState(session: Session) {
    if(session.isFuture) return;

    if(session.paymentState == SessionPaymentState.payed) {
      this.setPaymentState(session, SessionPaymentState.owed);
    }
    else if(session.paymentState == SessionPaymentState.owed) {
      this.setPaymentState(session, SessionPaymentState.payed);
    }

    this.prepForDisplay(session);
  }

  prepForDisplay(session: Session) {
    session.dateString = dayjs(session.date).format("MMMM D, YYYY H:mm");
    session.timeString = dayjs(session.date).format("H:mm");
    if(!session.datePayed) {
      session.datePayedString = '--'
    }
    else {
      session.datePayedString = dayjs(session.datePayed).format("MMMM D, YYYY");
    }
  }
}
