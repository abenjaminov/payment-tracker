import {ComponentService, getMonthName} from "../../../models";
import {BoxNumberDisplayComponentData} from "../box-number-display.component";
import {ApiService} from "../../../services/api.service";
import {Injectable} from "@angular/core";

@Injectable()
export class BoxNumberDisplayFutureRevenueService extends ComponentService {
  _isLoading: boolean = true;

  constructor(private apiService: ApiService) {
    super();
  }

  async getComponentData() : Promise<BoxNumberDisplayComponentData> {
    this._isLoading = true;
    let futureRevenue = await this.apiService.get('future-revenue');

    this._isLoading = false;

    return {
      title: `Future revenue`,
      value: `${futureRevenue}₪`
    }
  }

  isLoading() : boolean {
    return this._isLoading;
  }
}
