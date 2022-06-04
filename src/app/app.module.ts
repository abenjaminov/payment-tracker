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
import {SessionsComponent} from "./components/sessions-component/sessions.component";
import {FilterComponent} from "./components/filter-component/filter.component";
import {LoaderComponent} from "./components/loader-component/loader.component";
import {BoxNumberDisplayComponent} from "./components/box-number-display/box-number-display.component";
import {LoaderContentComponent} from "./components/loader-content/loader-content-component";
import {MessagePopupComponent} from "./components/message-popup/message-popup.component";
import {SessionCalendarComponent} from "./components/session-calendar/session-calendar.component";
import {SessionEditorComponent} from "./components/session-editor/session-editor.component";
import {PagingComponent} from "./components/paging/paging.component";

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    DashboardComponent,
    ClientProfileComponent,
    ClientsComponent,
    ClientSessionsComponent,
    HeaderComponent,
    SessionsComponent,
    FilterComponent,
    LoaderComponent,
    BoxNumberDisplayComponent,
    LoaderContentComponent,
    MessagePopupComponent,
    SessionCalendarComponent,
    SessionEditorComponent,
    PagingComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
