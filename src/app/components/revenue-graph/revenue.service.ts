import {Injectable} from "@angular/core";
import {getMonths} from "../../models";
import {ApiService} from "../../services/api.service";
import {EChartsOption} from "echarts";


@Injectable({
  providedIn: 'root'
})
export class RevenueService {

  private revenueGraphOptionsTemplate: EChartsOption = {
    legend: {
      data: ['Revenue per month'],
      align: 'left',
    },
    yAxis: {},
    tooltip: {},
    xAxis: {
      data: [],
      silent: false,
      splitLine: {
        show: false,
      }
    },
    series: [
      {
        name: 'Revenue per month',
        type: 'bar',
        data: [],
        animationDelay: (idx) => idx * 10 + 100,
      },
    ],
    animationEasing: 'elasticOut',
    animationDelayUpdate: (idx) => idx * 5,
  }

  constructor(private apiService: ApiService) {
  }

  async calculateRevenueGraphOptions() : Promise<any> {
    let options = Object.assign({}, this.revenueGraphOptionsTemplate);

    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();
    let months = getMonths(currentYear);
    let month = months[currentMonth];

    for(let i = 0; i < 12; i++) {
      let monthlyRevenue = await this.getMonthlyRevenue(month.month, month.year);

      let year = month.year.toString();

      (options.xAxis as any).data.unshift(`${month.monthName}, ${year[2] + year[3]}`)
      options.series[0].data.unshift(monthlyRevenue);

      const previousMonth = month.previousMonth;
      const previousYear = month.previousMonthYear;

      if(previousYear != currentYear) {
        months = getMonths(previousYear);
      }

      month = months[previousMonth];
    }

    return options;
  }

  async getSixMonthAverageRevenue() {
    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();
    let months = getMonths(currentYear);
    let month = months[currentMonth];

    let sum = 0;
    let count = 0;

    for(let i = 0; i < 6; i++) {
      let monthlyRevenue = await this.getMonthlyRevenue(month.month, month.year);;

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

    const result = Math.floor(sum / count);
    return result;
  }

  async getMonthlyRevenue(month: number, year: number) {
    const monthlyRevenue = await this.apiService.get('monthly-revenue', {
      month: month,
      year: year
    });

    return monthlyRevenue;
  }
}
