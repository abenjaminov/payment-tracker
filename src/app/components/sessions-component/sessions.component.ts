import {Component} from "@angular/core";
import {Session, SessionPaymentState, SessionsService} from "../../services/sessions.service";
import {NavigationService} from "../../services/navigation.service";
import {FilterService} from "../../services/filter.service";
import {MessagePopupComponentService} from "../message-popup/message-popup.component.service";
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

  constructor(private sessionsService: SessionsService,
              private pagingService: PagingComponentService,
              private navigationService: NavigationService, private filterService: FilterService, private messageService: MessagePopupComponentService) {
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

    await this.pagingService.load(PagedEntityNames.sessions);

    this.sessions = await this.sessionsService.getSessions({
      filterText: this.filterService.searchText,
      page: this.pagingService.page,
      pageSize: this.pagingService.pageSize
    });

    this.isLoading = false;
  }

  async onToggleSessionState(session: Session) {
    this.isLoading = true;
    this.sessionsService.toggleSessionPaymentState(session);
    await this.sessionsService.saveSession(session)

    await this.init();
    this.isLoading = false;
  }

  async onSearchTextChanged() {
    await this.init();
  }

  async goToClient(clientId: string) {
    await this.navigationService.navigateToRoute(`clients/${clientId}`);
  }

  async onDeleteSessionClicked(session: Session) {
    this.isLoading = true;
    await this.sessionsService.deleteSession(session);

    await this.init();
    this.isLoading = false;
  }
}
