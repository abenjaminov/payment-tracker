import {ComponentService, getMonthName, getMonths} from "../../../models";
import {Injectable} from "@angular/core";
import {ApiService} from "../../../services/api.service";
import {BoxNumberDisplayComponentData} from "../box-number-display.component";
import {RevenueService} from "../../revenue-graph/revenue.service";

@Injectable()
export class BoxNumberDisplayMonthlyRevenueAverageService extends ComponentService{
  _isLoading: boolean = true;

  constructor(private revenueService: RevenueService) {
    super();
  }

  async getComponentData(): Promise<BoxNumberDisplayComponentData> {

    const average = await this.revenueService.getSixMonthAverageRevenue();

    return {
      title: `Average Revenue (6 Months)`,
      value: `${average}₪`
    }
  }

  isLoading(): boolean {
    return this._isLoading;
  }
}
