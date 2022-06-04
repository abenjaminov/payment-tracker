import {Component} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {ClientService} from "../../services/client.service";

@Component({
  selector: 'trainer-profile',
  templateUrl: 'client-profile.component.html',
  styleUrls: ['client-profile.component.scss']
})
export class ClientProfileComponent {
  clientId: string;
  isLoading: boolean;

  constructor(private activatedRoute: ActivatedRoute, public clientService: ClientService) {
  }

  async ngOnInit() {
    this.isLoading = true;

    if(!this.activatedRoute.snapshot.paramMap.has("id")) return

    this.clientId = this.activatedRoute.snapshot.paramMap.get("id").toString();

    await this.clientService.loadClient(this.clientId);

    this.isLoading = false;
  }
}
