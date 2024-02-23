import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeComponent } from './component/employee/employee.component';
import { ClientComponent } from './component/client/client.component';
import { UserProfileComponent } from './component/user-profile/user-profile.component';
import {HomeComponent} from "./component/home/home.component";
import {RegisterUserComponent} from "./component/register-user/register-user.component";
import {LoginComponent} from "./component/login/login.component";
import {ProvidedServiceComponent} from "./component/employee/provided-service/provided-service.component";
import {EmployeeScheduleComponent} from "./component/employee/employee-schedule/employee-schedule.component";
import {EmployeeFinanceComponent} from "./component/employee/employee-finance/employee-finance.component";
import {
  ClientSearchServicesComponent
} from "./component/client/client-search-services/client-search-services.component";
import {
  ClientServiceAndBookingComponent
} from "./component/client/client-service-and-booking/client-service-and-booking.component";
import {ClientScheduleComponent} from "./component/client/client-schedule/client-schedule.component";
import {
  ClientAppointmentDetailsComponent
} from "./component/client/client-appointment-details/client-appointment-details.component";
import {
  EmployeeAppointmentDetailsComponent
} from "./component/employee/employee-appointment-details/employee-appointment-details.component";

const routes: Routes = [
  { path:'employee', component: EmployeeComponent, children: [
    { path:'services', component: ProvidedServiceComponent },
    { path:'schedule', component: EmployeeScheduleComponent },
    { path:'finance', component: EmployeeFinanceComponent },
    { path:'appointment/:appointmentId', component: EmployeeAppointmentDetailsComponent },
    { path: '**', pathMatch: "full", redirectTo: ""}
  ] },
  { path:'client', component: ClientComponent, children: [
      { path:'services', component: ClientSearchServicesComponent },
      { path:'service/:serviceId', component: ClientServiceAndBookingComponent },
      { path:'schedule', component: ClientScheduleComponent },
      { path:'appointment/:appointmentId', component: ClientAppointmentDetailsComponent },
      { path: '**', pathMatch: "full", redirectTo: ""}
  ] },
  { path:'user', component: UserProfileComponent },
  { path:'login', component: LoginComponent },
  { path:'register', component: RegisterUserComponent },
  { path: '**', component: HomeComponent, pathMatch: "full" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
