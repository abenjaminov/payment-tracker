import {ComponentService, getMonthName} from "../../../models";
import {BoxNumberDisplayComponentData} from "../box-number-display.component";
import {ApiService} from "../../../services/api.service";
import {Injectable} from "@angular/core";

@Injectable()
export class BoxNumberDisplayTotalDebtService extends ComponentService {
  _isLoading: boolean = true;

  constructor(private apiService: ApiService) {
    super();
  }

  async getComponentData() : Promise<BoxNumberDisplayComponentData> {
    this._isLoading = true;
    let debt = await this.apiService.get('debt');

    this._isLoading = false;

    return {
      title: `Total debt`,
      value: `${debt}₪`
    }
  }

  isLoading() : boolean {
    return this._isLoading;
  }
}
