import {Injectable} from "@angular/core";

export class Trainer {
  id: string;
  name: string;
  phoneNumber: string;
  debt: number;
  basePayment: number;
}

@Injectable({providedIn : 'root'})
export class TrainerService {
  isLoaded: boolean;
  allTrainers : Array<Trainer>

  async loadAllTrainers() : Promise<any> {
    this.isLoaded = false;

    this.allTrainers = [{
      id: '204535710',
      name: 'Asaf',
      phoneNumber: '0525516232',
      debt: 1000,
      basePayment: 100
    },{
      id: 'a1db243a-edae-4389-b091-88aec13d02d2',
      name: 'Tasha',
      phoneNumber: '0528817232',
      debt: 350,
      basePayment: 175
    }];

    this.isLoaded = true;

    return Promise.resolve();
  }
}
