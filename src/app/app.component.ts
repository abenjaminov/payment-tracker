import { Component } from '@angular/core';
import {VersionService} from "./services/version.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'payment-tracker-app';

  constructor(private versionService: VersionService) {
  }
}
