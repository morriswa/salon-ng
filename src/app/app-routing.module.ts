import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeComponent } from './component/employee/employee.component';
import { ClientComponent } from './component/client/client.component';
import { ClientProfileComponent } from './component/client/client-profile/client-profile.component';
import {HomeComponent} from "./component/home/home.component";
import {RegisterUserComponent} from "./component/registration/register-user/register-user.component";
import {LoginComponent} from "./component/login/login.component";
import {EmployeeServicesComponent} from "./component/employee/employee-services/employee-services.component";
import {EmployeeScheduleComponent} from "./component/employee/employee-schedule/employee-schedule.component";
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
import {AccessCodeComponent} from "./component/registration/access-code/access-code.component";
import {CreateProfileComponentComponent} from "./component/registration/create-profile-component/create-profile-component.component";
import {EmployeeProfileComponent} from "./component/employee/employee-profile/employee-profile.component";
import {PublicProfileComponent} from "./component/public-profile/public-profile.component";

const routes: Routes = [
  { path: 'employee', component: EmployeeComponent,
    children: [
      { path: 'user', component: EmployeeProfileComponent },
      { path: 'services', component: EmployeeServicesComponent },
      { path: 'schedule', component: EmployeeScheduleComponent },
      { path: 'appointment/:appointmentId', component: EmployeeAppointmentDetailsComponent },
      { path: '**', pathMatch: "full", redirectTo: "schedule"}
    ] },
  { path: 'client', component: ClientComponent,
    children: [
      { path: 'user', component: ClientProfileComponent },
      { path: 'services', component: ClientSearchServicesComponent },
      { path: 'service/:serviceId', component: ClientServiceAndBookingComponent },
      { path: 'schedule', component: ClientScheduleComponent },
      { path: 'appointment/:appointmentId', component: ClientAppointmentDetailsComponent },
      { path: '**', pathMatch: "full", redirectTo: "schedule"}
    ] },
  { path: 'profile/:employeeId', component: PublicProfileComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterUserComponent },
  { path: 'register2', component: CreateProfileComponentComponent },
  { path: 'register2/access', component: AccessCodeComponent },
  { path: '**', component: HomeComponent, pathMatch: "full" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
