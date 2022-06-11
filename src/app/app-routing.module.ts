import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DashboardComponent} from "./components/dashboard-component/dashboard.component";
import {ClientProfileComponent} from "./components/client-profile-component/client-profile.component";
import {ClientsComponent} from "./components/clients-component/clients.component";
import {SessionCalendarComponent} from "./components/session-calendar/session-calendar.component";

const routes: Routes = [{
  path: 'dashboard',
  component: DashboardComponent
  },
  {path: 'clients', component: ClientsComponent},
  {path: 'clients/:id', component: ClientProfileComponent},
  {path: 'calendar', component: SessionCalendarComponent},
  { path: '',   redirectTo: '/dashboard', pathMatch: 'full' }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
