import {Injectable} from "@angular/core";
import {ApiService} from "./api.service";
import {AirTableEntity, GetPagedArgs} from "../models";
import {
  MessagePopupComponentService,
  MessagePopupType
} from "../components/message-popup/message-popup.component.service";
import {systemMessages} from "../../messages";
import dayjs from "dayjs";

export interface GetSessionArgs extends GetPagedArgs{
  filterClientId?: string;
  filterMonth?: number;
  filterPaymentState?: SessionPaymentState
  filterText?: string;
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
  isFuture?: boolean;
  clientName?: string;
}

@Injectable({providedIn: 'root'})
export class SessionsService {

  constructor(private apiService: ApiService, private messageService: MessagePopupComponentService) {
  }

  async saveSession(sessionToEdit: Session) {
    await this.apiService.post('sessions', sessionToEdit);
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
    await this.apiService.post('sessions', sessionToAdd);
  }

  async getSessions(filter?: GetSessionArgs) {
    const result = await this.apiService.get(`sessions`, filter)

    this.fixSessions(result);

    return result;
  }

  fixSessions(sessions: Array<Session>) {
    for(let session of sessions) {
      session.date = new Date(session.date);
      session.dateString = dayjs(session.date).format("MMMM D, YYYY H:mm");
      session.timeString = dayjs(session.date).format("H:mm");

      const paymentState : any = SessionPaymentState[session.paymentState];
      session.paymentState = paymentState;
    }
  }

  toggleSessionPaymentState(session: Session) {
    if(session.isFuture) return;

    if(session.paymentState == SessionPaymentState.payed) {
      session.paymentState = SessionPaymentState.owed;
    }
    else if(session.paymentState == SessionPaymentState.owed) {
      this.setSessionPayed(session)
    }
  }

  setSessionPayed(session: Session) {
    session.paymentState = SessionPaymentState.payed;
    session.datePayed = new Date();
  }
}
