import {Injectable} from "@angular/core";
import {ApiService} from "./api.service";
import {AirTableEntity} from "../models";

export interface GetClientsArgs {
  filterId?: string;
  filterText?: string;
}

export class Client implements AirTableEntity {
  airTableId?: string;

  id?: string;
  name: string;
  phoneNumber: string;
  basePayment: number;
  debt: number;
  isActive: boolean;
}

@Injectable({providedIn : 'root'})
export class ClientService {
  isLoaded: boolean = false;
  allClients : Array<Client> = [];
  selectedClient: Client;

  constructor(private apiService: ApiService) {
  }

  async loadAllClients() : Promise<any> {
    this.isLoaded = false;

    this.allClients = await this.apiService.get('clients');

    this.isLoaded = true;

    return Promise.resolve();
  }

  async loadClient(id: string) {
    const result = await this.getClientById(id);
    this.selectedClient = result;
  }

  async saveClient(clientToAdd: Client) {
    await this.apiService.post('clients', clientToAdd);
  }

  async getClientById(id: string): Promise<Client> {
    let result = this.allClients.find(x => x.airTableId == id);

    if (result) return result;

    this.isLoaded = false;
    const filter: GetClientsArgs = {
      filterId : id
    }
    result = await this.apiService.get(`clients`, filter)
    this.isLoaded = true;

    return result;
  }

}
