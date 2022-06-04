import {Component} from "@angular/core";
import {NavigationService} from "../../services/navigation.service";
import dayjs from "dayjs";

@Component({
  selector: 'app-header',
  templateUrl: 'header.component.html',
  styleUrls: ['header.component.scss']
})
export class HeaderComponent {
  today: string;
  constructor(private navigationService: NavigationService) {
  }

  ngOnInit() {
    this.setDate();

    setInterval(() => {
      this.setDate();
    },1000)
  }

  setDate() {
    let today = new Date();
    this.today = dayjs(today).format("MMMM D, YYYY H:mm:ss");
  }

  async onBackClicked() {
    await this.navigationService.goBack();
  }
}
