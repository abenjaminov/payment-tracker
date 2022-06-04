import {Injectable} from "@angular/core";
import {BehaviorSubject, ReplaySubject} from "rxjs";

export class MessagePopupAction {
  text: string;
  isPrimary?: boolean;
  isClose?: boolean;
  action?: Function;
}

export enum MessagePopupType {
  info,
  error
}

export class MessagePopupOptions {
  title: string;
  message: string;
  ltr?:boolean = false;
  type: MessagePopupType
  actions: Array<MessagePopupAction>
}

@Injectable({
  providedIn: 'root'
})
export class MessagePopupComponentService {
  onShowPopup: ReplaySubject<MessagePopupOptions> = new ReplaySubject<MessagePopupOptions>(1);
  onClosePopup: ReplaySubject<void> = new ReplaySubject<void>(1);

  showMessage(options: MessagePopupOptions) {
    this.onShowPopup.next(options);
  }

  closeMessage() {
    this.onClosePopup.next();
  }
}
