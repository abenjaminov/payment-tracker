import {ComponentService, getMonthName, getMonths} from "../../../models";
import {Injectable} from "@angular/core";
import {ApiService} from "../../../services/api.service";
import {BoxNumberDisplayComponentData} from "../box-number-display.component";

@Injectable()
export class BoxNumberDisplayMonthlyRevenueAverageService extends ComponentService{
  _isLoading: boolean = true;

  constructor(private apiService: ApiService) {
    super();
  }

  async getComponentData(): Promise<BoxNumberDisplayComponentData> {
    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();
    let months = getMonths(currentYear);
    let month = months[currentMonth];

    let sum = 0;
    let count = 0;

    for(let i = 0; i < 6; i++) {
      let monthlyRevenue = await this.apiService.get('monthly-revenue', {
        month: month.month ,
        year: month.year
      });

      if(monthlyRevenue > 0) {
        sum += monthlyRevenue;
        count++;
      }

      const previousMonth = month.previousMonth;
      const previousYear = month.previousMonthYear;

      if(previousYear != currentYear) {
        months = getMonths(previousYear);
      }

      month = months[previousMonth];
    }

    return {
      title: `Average Revenue (6 Months)`,
      value: `${Math.floor(sum / count)}₪`
    }
  }

  isLoading(): boolean {
    return this._isLoading;
  }
}
