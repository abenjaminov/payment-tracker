import {Injectable} from "@angular/core";
import {ComponentService} from "../../../models";
import {SessionsService} from "../../../services/sessions.service";
import {BoxNumberDisplayComponentData} from "../box-number-display.component";

@Injectable()
export class BoxNumberDisplayYearlyReceiptsRevenueService extends ComponentService{
  _isLoading: boolean = true;

  constructor(private sessionService: SessionsService) {
    super();
  }

  async getComponentData(): Promise<BoxNumberDisplayComponentData> {
    this._isLoading = true;
    const year = new Date().getFullYear();

    let sessions = await this.sessionService.getAllSessions({
      filterPaymentYear: year,
      filterReceipt: true
    })

    this._isLoading = false;

    let value = 0;

    if(sessions.length) {
      value = sessions.map(x => x.payment).reduce((sum: any, current) => {
        return sum + current
      })
    }

    return {
      value: value.toString(),
      title: `${year} Receipts`
    };
  }

  isLoading(): boolean {
    return this._isLoading;
  }

}
