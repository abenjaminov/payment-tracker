import {Component} from "@angular/core";
import {ClientService} from "../../services/client.service";

@Component({
  selector: 'trainers',
  templateUrl: 'clients.component.html',
  styleUrls: ['clients.component.scss']
})
export class ClientsComponent {

  constructor(public trainerService: ClientService) {
  }

  async ngOnInit() {
    await this.trainerService.loadAllTrainers();
  }
}
