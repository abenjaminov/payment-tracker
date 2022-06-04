import {Component, Input} from "@angular/core";
import {ComponentService} from "../../models";

export class BoxNumberDisplayComponentData {
  title: string;
  value: string;
}

@Component({
  selector: 'box-number-display',
  templateUrl: 'box-number-display.component.html',
  styleUrls: ['box-number-display.component.scss']
})
export class BoxNumberDisplayComponent {
  @Input() service: ComponentService;

  componentData: BoxNumberDisplayComponentData;

  async ngOnInit() {
    this.componentData = await this.service.getComponentData();
  }
}
