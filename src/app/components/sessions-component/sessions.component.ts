import {Component} from "@angular/core";
import {Session, SessionPaymentState, SessionsService} from "../../services/sessions.service";
import {NavigationService} from "../../services/navigation.service";
import {FilterService} from "../../services/filter.service";
import {MessagePopupComponentService, MessagePopupType} from "../message-popup/message-popup.component.service";
import {PagedEntityNames, PagingComponentService} from "../paging/paging.component.service";

@Component({
  selector: 'sessions',
  templateUrl: 'sessions.component.html',
  styleUrls: ['sessions.component.scss'],
  providers: [FilterService, PagingComponentService]
})
export class SessionsComponent {
  sessions: Array<Session>

  SessionPaymentState = SessionPaymentState

  isLoading: boolean;

  selectedCount: number = 0;

  loadingSessionIds: {[key: string] : boolean} = {};
  isSessionSelected: {[key: string] : boolean} = {};

  sessionsMap: {[airTableId: string] : Session};

  constructor(private sessionsService: SessionsService,
              private pagingService: PagingComponentService,
              private navigationService: NavigationService,
              private filterService: FilterService,
              private messageService: MessagePopupComponentService) {
    this.filterService.searchTextChanged.subscribe((text) => {
      this.onSearchTextChanged()
    })

    this.pagingService.onPageChange.subscribe(() => {
      this.init(true);
    })
  }

  async ngOnInit() {
    await this.init(true);
  }

  async init(showLoading = false) {
    if(showLoading) this.isLoading = true;

    this.isSessionSelected = {};

    await this.pagingService.load(PagedEntityNames.sessions);

    this.sessions = await this.sessionsService.getSessions({
      filterText: this.filterService.searchText,
      page: this.pagingService.page,
      pageSize: this.pagingService.pageSize
    });

    this.sessionsMap = {};

    this.sessions.forEach((session) => {
      this.sessionsMap[session.airTableId] = session;
    })

    this.isLoading = false;
  }

  async onToggleSessionState(session: Session) {
    // if(this.selectedCount > 0) {
    //   let keys = Object.keys(this.isSessionSelected).filter(x => this.isSessionSelected[x]);
    //   let isAllSameState = true;
    //   let firstState = this.sessionsMap[keys[0]].paymentState;
    //
    //   for (let i = 1; i < keys.length && isAllSameState; i++) {
    //     isAllSameState = this.sessionsMap[keys[i]].paymentState === firstState;
    //   }
    //
    //   if(!isAllSameState) {
    //     this.messageService.showMessage({
    //       title: 'שגיאה',
    //       message: 'יש לבחור רק אימונים אשר נמצאים באותו מצב תשלום לפני ביצוע פעולה זו.',
    //       type: MessagePopupType.error,
    //       actions: [{
    //         text: 'סגור',
    //         isClose: true,
    //         isPrimary: true
    //       }]
    //     })
    //   }
    //   else {
    //     const sessionsToEdit = keys.map(key => this.sessionsMap[key]);
    //
    //     for (const sessionToEdit of sessionsToEdit) {
    //       this.loadingSessionIds[sessionToEdit.airTableId] = true;
    //       this.sessionsService.toggleSessionPaymentState(sessionToEdit);
    //     }
    //
    //     setTimeout(async () => {
    //       await this.sessionsService.saveSession(sessionsToEdit)
    //
    //       for (const sessionToEdit of sessionsToEdit) {
    //         this.loadingSessionIds[sessionToEdit.airTableId] = false;
    //       }
    //     })
    //   }
    // }
    // else {
    //   this.loadingSessionIds[session.airTableId] = true;
    //   this.sessionsService.toggleSessionPaymentState(session);
    //   setTimeout(async () => {
    //     await this.sessionsService.saveSession([session])
    //
    //     this.loadingSessionIds[session.airTableId] = false;
    //   })
    // }
  }

  async onSearchTextChanged() {
    await this.init();
  }

  async goToClient(clientId: string) {
    await this.navigationService.navigateToRoute(`clients/${clientId}`);
  }

  async onDeleteSessionClicked(session: Session) {
    // let sessionsToDelete = [session];
    // if(this.selectedCount > 0) {
    //   let keys = Object.keys(this.isSessionSelected).filter(x => this.isSessionSelected[x]);
    //   sessionsToDelete = keys.map(x => this.sessionsMap[x]);
    // }
    //
    // this.isLoading = true;
    // let deletePromises = sessionsToDelete.map((x) => this.sessionsService.deleteSession(x));
    // await Promise.all(deletePromises);
    //
    // await this.init();
    // this.isLoading = false;
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
