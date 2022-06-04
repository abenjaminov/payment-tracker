import {ComponentService, getMonthName} from "../models";
import {BoxNumberDisplayComponentData} from "../components/box-number-display/box-number-display.component";
import {ApiService} from "./api.service";
import {Injectable} from "@angular/core";

@Injectable()
export class BoxNumberDisplayMonthlyRevenueService extends ComponentService {
  _isLoading: boolean = true;

  constructor(private apiService: ApiService) {
    super();
  }

  async getComponentData() : Promise<BoxNumberDisplayComponentData> {
    this._isLoading = true;
    let monthlyRevenue = await this.apiService.get('monthly-revenue');

    this._isLoading = false;

    return {
      title: `Revenue for ${getMonthName(new Date().getMonth())}`,
      value: `${monthlyRevenue}₪`
    }
  }

  isLoading() : boolean {
    return this._isLoading;
  }
}
