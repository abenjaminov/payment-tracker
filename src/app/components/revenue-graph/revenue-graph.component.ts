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
  options: any = {};

  constructor(private revenueService: RevenueService) {
  }

  async ngOnInit() {
    this.options = await this.revenueService.calculateRevenueGraphOptions();
  }
}
