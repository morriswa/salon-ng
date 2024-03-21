import { enableProdMode } from '@angular/core';

import { environment } from './environments/environment';
import {SalonApplication} from "./app/salon-application.component";
import {bootstrapApplication} from "@angular/platform-browser";
import {provideRouter, Routes} from "@angular/router";
import {EmployeeComponent} from "./app/component/employee/employee.component";
import {ProfileComponent} from "./app/component/shared/profile/profile.component";
import {EmployeeServicesComponent} from "./app/component/employee/employee-services/employee-services.component";
import {EmployeeScheduleComponent} from "./app/component/employee/employee-schedule/employee-schedule.component";
import {
  EmployeeAppointmentDetailsComponent
} from "./app/component/employee/employee-appointment-details/employee-appointment-details.component";
import {ClientComponent} from "./app/component/client/client.component";
import {
  ClientSearchServicesComponent
} from "./app/component/client/client-search-services/client-search-services.component";
import {
  ClientServiceAndBookingComponent
} from "./app/component/client/client-service-and-booking/client-service-and-booking.component";
import {ClientScheduleComponent} from "./app/component/client/client-schedule/client-schedule.component";
import {
  ClientAppointmentDetailsComponent
} from "./app/component/client/client-appointment-details/client-appointment-details.component";
import {PublicProfileComponent} from "./app/component/shared/public-profile/public-profile.component";
import {LoginComponent} from "./app/component/login/login.component";
import {RegisterUserComponent} from "./app/component/registration/register-user/register-user.component";
import {
  CreateProfileComponentComponent
} from "./app/component/registration/create-profile-component/create-profile-component.component";
import {AccessCodeComponent} from "./app/component/registration/access-code/access-code.component";
import {HomeComponent} from "./app/component/home/home.component";
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi
} from "@angular/common/http";
import {LoginService} from "./app/service/login.service";
import {CredentialService} from "./app/service/credential.service";
import {SalonClient} from "./app/service/salon-client.service";
import {AddTokenInterceptor} from "./app/interceptor/AddTokenInterceptor";
import {provideAnimations} from "@angular/platform-browser/animations";

if (environment.production) {
  enableProdMode();
}

const routes: Routes = [
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

bootstrapApplication(SalonApplication,{
  providers: [
    provideAnimations(),
    provideRouter(routes),
    CredentialService,
    LoginService,
    SalonClient,
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AddTokenInterceptor,
      multi: true,
    },
  ]
}).catch(err => console.error(err));
