import {Component, Input} from "@angular/core";
import {PagingComponentService} from "./paging.component.service";

@Component({
  selector: 'paging',
  templateUrl: 'paging.component.html',
  styleUrls: ['paging.component.scss']
})
export class PagingComponent {
  pages: Array<number>;
  splitPages: boolean;
  showFirstPage: boolean;
  showLastPage: boolean;
  minPagesForSplit: number = 8;

  constructor(public pagingService: PagingComponentService) {
    this.pagingService.onPageLoad.subscribe(() => {
      this.init();
    })

    this.pagingService.onPageServiceLoaded.subscribe(() => {
      this.init();
    })
  }

  init() {
    this.pages = [];
    if(this.pagingService.numberOfPages > this.minPagesForSplit) {
      this.splitPages = true;
      this.showFirstPage = true;
      this.showLastPage = true;

      for(let i = this.pagingService.page - 2; i < this.pagingService.page + 4 &&
                                               i <= this.pagingService.numberOfPages; i++) {
        if(i <= 0) continue;
        if(i == 1) this.showFirstPage = false;
        if(i == this.pagingService.numberOfPages) this.showLastPage = false;
        this.pages.push(i);
      }
    }
    else {
      this.pages = Array.from({length: this.pagingService.numberOfPages}, (_, i) => i + 1)
    }
  }

  onPageLinkClicked(page: number) {
    this.pagingService.page = page;
  }

  onNextPageClicked() {
    this.pagingService.loadNextPage();
  }
}
