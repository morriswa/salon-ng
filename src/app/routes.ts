// NG
import {Routes} from "@angular/router";

// Salon Application
import {LoginComponent} from "src/app/component/login/login.component";
import {HomeComponent} from "src/app/component/home/home.component";

// Registration
import {RegisterUserComponent} from "src/app/component/registration/register-user/register-user.component";
import {
  CreateProfileComponentComponent
} from "src/app/component/registration/create-profile-component/create-profile-component.component";
import {AccessCodeComponent} from "src/app/component/registration/access-code/access-code.component";

// Shared
import {ProfileComponent} from "src/app/component/shared/profile/profile.component";
import {PublicProfileComponent} from "src/app/component/shared/public-profile/public-profile.component";

// Employee
import {EmployeeComponent} from "src/app/component/employee/employee.component";
import {EmployeeServicesComponent} from "src/app/component/employee/employee-services/employee-services.component";
import {EmployeeScheduleComponent} from "src/app/component/employee/employee-schedule/employee-schedule.component";
import {
  EmployeeAppointmentDetailsComponent
} from "src/app/component/employee/employee-appointment-details/employee-appointment-details.component";

// Client
import {ClientComponent} from "src/app/component/client/client.component";
import {
  ClientSearchServicesComponent
} from "src/app/component/client/client-search-services/client-search-services.component";
import {
  ClientServiceAndBookingComponent
} from "src/app/component/client/client-service-and-booking/client-service-and-booking.component";
import {ClientScheduleComponent} from "src/app/component/client/client-schedule/client-schedule.component";
import {
  ClientAppointmentDetailsComponent
} from "src/app/component/client/client-appointment-details/client-appointment-details.component";



// Define application routes
export const salon_application_routes: Routes = [
  { path: 'employee', component: EmployeeComponent,
    children: [
      { path: 'user', component: ProfileComponent },
      { path: 'services', component: EmployeeServicesComponent },
      { path: 'schedule', component: EmployeeScheduleComponent },
      { path: 'appointment/:appointmentId', component: EmployeeAppointmentDetailsComponent },
      { path: '**', pathMatch: "full", redirectTo: "schedule"}
    ] },
  { path: 'client', component: ClientComponent,
    children: [
      { path: 'user', component: ProfileComponent },
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
