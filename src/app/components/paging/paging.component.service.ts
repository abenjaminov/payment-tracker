import {Injectable} from "@angular/core";
import {ApiService} from "../../services/api.service";
import {ReplaySubject} from "rxjs";
import {GetResult} from "../../models";

export enum PagedEntityNames {
  sessions= 'sessions',
  clients = 'clients'
}

export interface FetchPageArgs {
  pageSize: number,
  offset: string
}

@Injectable()
export class PagingComponentService {
  onPageLoading: ReplaySubject<void> = new ReplaySubject<void>(1);
  onPageLoad: ReplaySubject<Array<any>> = new ReplaySubject<Array<any>>(1);
  onPageServiceLoaded: ReplaySubject<void> = new ReplaySubject<void>(1);

  page: number = -1;
  pageSize: number;
  numberOfPages: number;
  totalCount: number;
  entityName: PagedEntityNames;

  isLoaded: boolean = false;

  fetch: (args: FetchPageArgs) => Promise<GetResult<any>>;
  offset: string;

  constructor(private apiService: ApiService) {
  }

  async loadNextPage() {
    this.onPageLoading.next();

    const result = await this.fetch({
      pageSize: this.pageSize,
      offset: this.offset
    });

    this.offset = result.offset;

    this.onPageLoad.next(result.objects);
  }

  async load(entityName: PagedEntityNames, pageSize = 25, fetch: (args: FetchPageArgs) => Promise<GetResult<any>>) {
    this.fetch = fetch;
    this.entityName = entityName;
    this.pageSize = pageSize;
    this.offset = undefined;

    await this.loadNextPage()

    this.isLoaded = true;
    this.onPageServiceLoaded.next();
  }
}
