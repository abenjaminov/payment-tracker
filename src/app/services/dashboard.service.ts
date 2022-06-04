import {Injectable} from "@angular/core";
import {ApiService} from "./api.service";

@Injectable({providedIn: 'root'})
export class DashboardService {
  isLoaded: boolean;
  monthlyRevenue: number;
  totalDebt: number;
  totalFutureRevenue



  constructor(private apiService: ApiService) {
  }

  async load(month:number) {
    this.isLoaded = false;

    this.monthlyRevenue = await this.apiService.get('monthly-revenue', month)
    this.totalDebt = await this.apiService.get('debt');
    this.totalFutureRevenue = await this.apiService.get('future-revenue')

    this.isLoaded = true;
  }
}
