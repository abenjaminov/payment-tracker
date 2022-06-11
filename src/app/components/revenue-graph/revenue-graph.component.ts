import {Component} from "@angular/core";
import {EChartsOption} from "echarts";
import {monthNames} from "../../models";
import {RevenueService} from "./revenue.service";

@Component({
  selector: 'revenue-graph',
  templateUrl: 'revenue-graph.component.html',
  styleUrls: ['revenue-graph.component.scss']
})
export class RevenueGraphComponent {
  options: any;
  isLoading: boolean;

  constructor(private revenueService: RevenueService) {
  }

  async ngOnInit() {
    if(this.options) return;

    this.isLoading = true;
    this.options = await this.revenueService.calculateRevenueGraphOptions();
    this.isLoading = false;
  }
}
