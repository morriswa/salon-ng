
/**
 * Salon UI Application Runner
 *
 * @author William A. Morris
 * @since 2024-02-02
 */

// NG
import {enableProdMode} from '@angular/core';
import {bootstrapApplication} from "@angular/platform-browser";
import {provideAnimations} from "@angular/platform-browser/animations";
import {provideRouter, Routes} from "@angular/router";
import {provideHttpClient, withInterceptors} from "@angular/common/http";

// Application Environment
import {environment} from 'src/environments/environment';

// Http Interceptor
import {add_token_interceptor} from "src/add-token-interceptor";

// Salon Application
import {SalonApplication} from "src/app/salon-application.component";
import {LoginComponent} from "src/app/component/login/login.component";
import {HomeComponent} from "src/app/component/home/home.component";

// Salon Portal Components

  // Registration
  import {RegisterUserComponent} from "./app/component/registration/register-user/register-user.component";
  import {
    CreateProfileComponentComponent
  } from "./app/component/registration/create-profile-component/create-profile-component.component";
  import {AccessCodeComponent} from "./app/component/registration/access-code/access-code.component";

  // Shared
  import {ProfileComponent} from "./app/component/shared/profile/profile.component";
  import {PublicProfileComponent} from "./app/component/shared/public-profile/public-profile.component";

  // Employee
  import {EmployeeComponent} from "./app/component/employee/employee.component";
  import {EmployeeServicesComponent} from "./app/component/employee/employee-services/employee-services.component";
  import {EmployeeScheduleComponent} from "./app/component/employee/employee-schedule/employee-schedule.component";
  import {
    EmployeeAppointmentDetailsComponent
  } from "./app/component/employee/employee-appointment-details/employee-appointment-details.component";

  // Client
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

// Core Services
import {LoginService} from "./app/service/login.service";
import {CredentialService} from "./app/service/credential.service";
import {SalonClient} from "./app/service/salon-client.service";


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


// enables production mode for prod builds
if (environment.production) enableProdMode();
// bootstrap salon application
bootstrapApplication(SalonApplication,{
  providers: [
    // with angular animation, router, and http client
    provideAnimations(),
    provideRouter(salon_application_routes),
    provideHttpClient(withInterceptors([add_token_interceptor])),
    // provide essential application services
    CredentialService,
    LoginService,
    SalonClient,
  ]
// log all errors to the js console
}).catch(err => console.error(err));
