import {Injectable} from "@angular/core";
import {ApiService} from "../../services/api.service";
import {ReplaySubject} from "rxjs";

export enum PagedEntityNames {
  sessions= 'sessions',
  clients = 'clients'
}

@Injectable()
export class PagingComponentService {
  onPageChange: ReplaySubject<void> = new ReplaySubject<void>(1);
  onPageServiceLoaded: ReplaySubject<void> = new ReplaySubject<void>(1);

  private _currentPage: number = -1;
  pageSize: number;
  numberOfPages: number;
  totalCount: number;
  entityName: PagedEntityNames;

  constructor(private apiService: ApiService) {
  }

  get page() {
    return this._currentPage;
  }

  set page(page: number) {
    this._currentPage = page;

    this.onPageChange.next();
  }

  async load(entityName: PagedEntityNames, pageSize = 25) {
    this.entityName = entityName;
    this.pageSize = pageSize;
    this.totalCount = await this.apiService.get('count', this.entityName);

    this.numberOfPages = Math.floor(this.totalCount / this.pageSize) + 1;

    if(this._currentPage == -1) this._currentPage = 1;

    this.onPageServiceLoaded.next();
  }
}
