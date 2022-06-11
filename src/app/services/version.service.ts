import {Injectable} from "@angular/core";
import {
  MessagePopupComponentService,
  MessagePopupType
} from "../components/message-popup/message-popup.component.service";
import {ApiService} from "./api.service";
import {CacheService} from "./cache";
import {NavigationService} from "./navigation.service";
import {Subscription} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class VersionService {
  sub: Subscription;
  constructor(private messageService: MessagePopupComponentService,
              private apiService: ApiService,
              private cacheService: CacheService,
              private navigationService: NavigationService) {


    this.checkVersionMismatch();

    setInterval(async () => {
        this.checkVersionMismatch();
    },15000)
  }

  async checkVersionMismatch() {
    console.log("checkVersionMismatch")
    if(this.sub) return;

    const isVersionMismatch = await this.apiService.isVersionMatching();

    if(isVersionMismatch) {
      this.sub = this.messageService.onMessageClosing.subscribe(async () => {
        await this.updateClient();
      })

      this.messageService.showMessage({
        title: 'יצא עדכון!',
        message: 'ברגע שיסגר החלון האתר יעדכן את עצמו',
        type : MessagePopupType.info,
        actions: [{
          text: 'עדכן',
          isClose: true,
          isPrimary: true
        }]
      })
    }
  }

  async updateClient() {
    this.sub.unsubscribe();
    this.sub = undefined;

    this.cacheService.clear();
    await this.navigationService.navigateToRoute(`dashboard`);

    window.location.reload();
  }
}
