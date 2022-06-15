import {Component} from "@angular/core";
import {DashboardService} from "../../services/dashboard.service";
import {BoxNumberDisplayTotalDebtService} from "../box-number-display/services/box-number-display-total-debt.service";
import {BoxNumberDisplayFutureRevenueService} from "../box-number-display/services/box-number-display-future-revenue.service";
import {BoxNumberDisplayThisMonthRevenueService} from "../box-number-display/services/box-number-display-this-month-revenue.service";
import {BoxNumberDisplayMonthlyRevenueAverageService} from "../box-number-display/services/box-number-display-monthly-revenue-average.service";
import {monthNames} from "../../models";
import {NgxEchartsConfig} from "ngx-echarts/lib/ngx-echarts.directive";
import {EChartsOption} from "echarts";
import {BoxNumberDisplayYearlyReceiptsRevenueService} from "../box-number-display/services/box-number-display-yearly-receipts-revenue.service";

@Component({
  selector: 'dashboard',
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.scss'],
  providers: [BoxNumberDisplayThisMonthRevenueService,
  BoxNumberDisplayYearlyReceiptsRevenueService,
    BoxNumberDisplayTotalDebtService, BoxNumberDisplayFutureRevenueService, BoxNumberDisplayMonthlyRevenueAverageService]
})
export class DashboardComponent {
  constructor(public dashboardService: DashboardService,
              public boxNumberThisMonthRevenueAverageService: BoxNumberDisplayMonthlyRevenueAverageService,
              public boxNumberThisMonthRevenueService: BoxNumberDisplayThisMonthRevenueService,
              public boxNumberDisplayTotalDebtService: BoxNumberDisplayTotalDebtService,
              public boxNumberDisplayFutureRevenueService: BoxNumberDisplayFutureRevenueService,
              public boxNumberDisplayYearlyReceiptsRevenueService: BoxNumberDisplayYearlyReceiptsRevenueService) {
  }
}
