import {Component} from "@angular/core";
import {Client, ClientService} from "../../services/client.service";
import {NavigationService} from "../../services/navigation.service";
import {MessagePopupComponentService, MessagePopupType} from "../message-popup/message-popup.component.service";
import {systemMessages} from "../../../messages";

@Component({
  selector: 'trainers',
  templateUrl: 'clients.component.html',
  styleUrls: ['clients.component.scss']
})
export class ClientsComponent {

  clientToAdd: Client;
  isLoading: boolean;

  editedClient: Client;

  constructor(public clientService: ClientService, private navigationService: NavigationService, private messageService: MessagePopupComponentService) {
  }

  async ngOnInit() {
    await this.init(true);
  }

  async init(showLoading: boolean = false) {
    if(showLoading) this.isLoading = true;
    await this.clientService.loadAllClients();
    this.initClientToAdd();

    this.isLoading = false;
  }

  initClientToAdd() {
    this.clientToAdd = {
      debt: 0,
      basePayment : 150,
      name: '',
      phoneNumber: '',
      isActive: true
    }
  }

  onClientClicked(client : Client) {
    this.navigationService.navigateToRoute(`clients/${client.airTableId}`);
  }

  canAdd() {
    return this.clientToAdd.name != '' && this.clientToAdd.phoneNumber != '';
  }

  async onAddClientClicked($event: Event) {
    $event.stopPropagation();

    if(!this.canAdd()) {
      this.messageService.showMessage({
        title: systemMessages.cantAddClientTitle,
        message : systemMessages.cantAddClientMessage,
        type: MessagePopupType.error,
        actions : [{
          isClose: true,
          text : 'Close'
        }]
      })
      return;
    }

    await this.saveClient(this.clientToAdd)
  }

  async onSaveClientClicked($event: Event, clientToSave: Client) {
    $event.stopPropagation();

    await this.saveClient(clientToSave)
  }

  async saveClient(clientToSave: Client) {
    await this.clientService.saveClient(clientToSave);

    await this.init();
  }

  async onEditClientClicked($event: Event, clientToEdit: Client) {
    $event.stopPropagation();

    if(!this.editedClient) {
      this.editedClient = clientToEdit;
    }
    else {
      this.messageService.showMessage({
        title: systemMessages.alreadyEditingTitle,
        message: systemMessages.alreadyEditingMessage,
        type: MessagePopupType.info,
        actions: [{
          text: 'ביטול',
          isClose: true,
          action: () => {
            this.editedClient = clientToEdit;
          }
        },{
          text: 'שמירה',
          isPrimary: true,
          action : async () => {
            this.messageService.closeMessage();
            await this.saveClient(this.editedClient)

            this.editedClient = clientToEdit;
          }
        }]
      })
    }
  }
}
