import {Injectable} from "@angular/core";
import {BehaviorSubject, ReplaySubject} from "rxjs";

@Injectable()
export class FilterService {
  searchText:string;

  searchTextChanged: ReplaySubject<string> = new ReplaySubject<string>(1);
  searchTimeout: any;
  onSearchTextChanged() {

    if(this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    this.searchTimeout = setTimeout(() => {
      this.searchTextChanged.next(this.searchText);
      this.searchTimeout = undefined;
    },275)


  }
}
