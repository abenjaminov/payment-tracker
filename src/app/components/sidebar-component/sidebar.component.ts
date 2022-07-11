import {Component} from "@angular/core";
import {NavigationService} from "../../services/navigation.service";
import {NavigationEnd, Router} from "@angular/router";

interface SidebarAction {
  text: string;
  isSelected:boolean;
  href: string;
}

@Component({
  selector: 'sidebar',
  templateUrl: 'sidebar.component.html',
  styleUrls: ['sidebar.component.scss']
})
export class SidebarComponent {
  selectedAction: SidebarAction;
  actions : Array<SidebarAction> = [{
    text: 'Dashboard',
    href: '/dashboard',
    isSelected: false
  }, /*{
    text: 'Clients',
    href: '/clients',
    isSelected: false
  },*/{
    text: 'Calendar',
    href: '/calendar',
    isSelected: false
  }]

  constructor(private navigationService: NavigationService, private router: Router) {
    router.events.subscribe((event) => {
      if(event instanceof NavigationEnd) {
        this.updateSelectedAction();
      }
    })
  }

  async onActionClicked(action : SidebarAction) {
    await this.navigationService.navigateToRoute(action.href);
  }

  updateSelectedAction() {
    if(this.selectedAction) {
      this.selectedAction.isSelected = false;
    }

    this.selectedAction = this.actions.find(x => this.router.url.startsWith(x.href))
    this.selectedAction.isSelected = true;
  }
}
