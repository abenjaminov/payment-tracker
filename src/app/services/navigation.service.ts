import {Injectable} from "@angular/core";
import {NavigationEnd, NavigationStart, Router} from "@angular/router";

@Injectable({providedIn: "root"})
export class NavigationService {
  navigationHistory: Array<string> = [];

  isGoingBack: boolean;

  constructor(private router: Router) {
    router.events.subscribe(event => {
      if(!this.isGoingBack && event instanceof NavigationStart) {
        this.navigationHistory.push(this.router.url);
      }
      else if(event instanceof NavigationEnd && this.isGoingBack) {
        this.isGoingBack = false;
      }
    })
  }

  async navigateToRoute(route:string, params? : Array<string>) {
    await this.router.navigate([route]);
  }

  async goBack() {
    if(this.navigationHistory.length == 0) await this.navigateToRoute('');

    let url = this.navigationHistory[this.navigationHistory.length - 1];
    this.isGoingBack = true;
    await this.navigateToRoute(url);
  }
}
