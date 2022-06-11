import { Component } from '@angular/core';
import {VersionService} from "./services/version.service";
import {apiVersion} from "./services/api";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'payment-tracker-app';
  version: string;

  constructor(private versionService: VersionService) {
    this.version = apiVersion;
  }
}
