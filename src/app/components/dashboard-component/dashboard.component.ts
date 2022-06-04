import {Component} from "@angular/core";
import {DashboardService} from "../../services/dashboard.service";
import {BoxNumberDisplayMonthlyRevenueService} from "../box-number-display/services/box-number-display-monthly-revenue.service";
import {BoxNumberDisplayTotalDebtService} from "../box-number-display/services/box-number-display-total-debt.service";
import {BoxNumberDisplayFutureRevenueService} from "../box-number-display/services/box-number-display-future-revenue.service";

@Component({
  selector: 'dashboard',
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.scss'],
  providers: [BoxNumberDisplayMonthlyRevenueService, BoxNumberDisplayTotalDebtService, BoxNumberDisplayFutureRevenueService]
})
export class DashboardComponent {

  constructor(public dashboardService: DashboardService,
              public boxNumberDisplayMonthlyRevenueService: BoxNumberDisplayMonthlyRevenueService,
              public boxNumberDisplayTotalDebtService: BoxNumberDisplayTotalDebtService,
              public boxNumberDisplayFutureRevenueService: BoxNumberDisplayFutureRevenueService) {
  }

  async ngOnInit() {
  }
}
