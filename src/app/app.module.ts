import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {SidebarComponent} from "./components/sidebar-component/sidebar.component";
import {DashboardComponent} from "./components/dashboard-component/dashboard.component";
import {ClientProfileComponent} from "./components/client-profile-component/client-profile.component";
import {ClientsComponent} from "./components/clients-component/clients.component";
import {ClientSessionsComponent} from "./components/client-sessions-component/client-sessions.component";
import {HeaderComponent} from "./components/header-component/header.component";
import {FormsModule} from "@angular/forms";
import {DatePipe} from "@angular/common";
import {FilterComponent} from "./components/filter-component/filter.component";
import {LoaderComponent} from "./components/loader-component/loader.component";
import {BoxNumberDisplayComponent} from "./components/box-number-display/box-number-display.component";
import {LoaderContentComponent} from "./components/loader-content/loader-content-component";
import {MessagePopupComponent} from "./components/message-popup/message-popup.component";
import {SessionCalendarComponent} from "./components/session-calendar/session-calendar.component";
import {SessionEditorComponent} from "./components/session-editor/session-editor.component";
import {PagingComponent} from "./components/paging/paging.component";
import {NgxEchartsModule} from "ngx-echarts";
import {RevenueGraphComponent} from "./components/revenue-graph/revenue-graph.component";
import {SessionDayComponent} from "./components/session-day/session-day.component";
import {SessionSummaryComponent} from "./components/session-summary/session-summary.component";
import {HttpClientModule} from "@angular/common/http";

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    DashboardComponent,
    ClientProfileComponent,
    ClientsComponent,
    ClientSessionsComponent,
    HeaderComponent,
    FilterComponent,
    LoaderComponent,
    BoxNumberDisplayComponent,
    LoaderContentComponent,
    MessagePopupComponent,
    SessionCalendarComponent,
    SessionEditorComponent,
    PagingComponent,
    RevenueGraphComponent,
    SessionDayComponent,
    SessionSummaryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    })
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
