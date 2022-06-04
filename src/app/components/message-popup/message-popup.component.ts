import {Component} from "@angular/core";
import {
  MessagePopupAction,
  MessagePopupComponentService,
  MessagePopupOptions,
  MessagePopupType
} from "./message-popup.component.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'message-popup',
  templateUrl : 'message-popup.component.html',
  styleUrls: ['message-popup.component.scss']
})
export class MessagePopupComponent {
  isOpen: boolean = false;
  options: MessagePopupOptions = new MessagePopupOptions();

  MessagePopupType = MessagePopupType;

  showSub: Subscription
  closeSub: Subscription;

  constructor(private messagePopupComponentService: MessagePopupComponentService) {
    this.showSub = messagePopupComponentService.onShowPopup.subscribe((options) => {
      this.showPopup(options);
    })

    this.closeSub = messagePopupComponentService.onClosePopup.subscribe(() => {
      this.closePopup();
    })
  }

  ngOnDestroy() {
    this.showSub.unsubscribe();
    this.closeSub.unsubscribe();
  }

  showPopup(options: MessagePopupOptions) {
    this.isOpen = true;
    this.options = options;
  }

  preventClosePopup($event: Event) {
    $event.stopPropagation();
  }

  closePopup() {
    this.isOpen = false;
  }

  onActionClicked(action: MessagePopupAction) {
    if(action.action) action.action();
    if(action.isClose) this.closePopup();
  }
}
