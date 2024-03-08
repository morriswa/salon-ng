
// Import Angular Core
import { NgModule } from '@angular/core';

// Required Angular Modules
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

// Required Angular Material Modules
import { MatNativeDateModule, MatOptionModule } from "@angular/material/core";
import { MatSelectModule } from "@angular/material/select";
import { MatInputModule } from "@angular/material/input";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatTableModule } from "@angular/material/table";
import { MatSortModule } from "@angular/material/sort";

// Interceptors
import { AddTokenInterceptor } from './interceptor/AddTokenInterceptor';

// Pipes
import { LocaleDatePipe } from "./pipe/AsLocaleDate.pipe";
import { LocaleTimePipe } from "./pipe/AsLocaleTime.pipe";
import { AmericanPhoneNumberPipe } from "./pipe/AmericanPhoneNumber.pipe";
import { AmericanFormattedDatePipe } from "./pipe/AmericanFormattedDate.pipe";

// Application Services
import { LoginService } from "./service/login.service";
import { CredentialService } from "./service/credential.service";

// Service Client
import { SalonClient } from './service/salon-client.service';

// App Router
import { AppRoutingModule } from './app-routing.module';

// Base App Component
import { AppComponent } from './app.component';

// Account Components
import { LoginComponent } from "./component/login/login.component";
import { RegisterUserComponent } from "./component/registration/register-user/register-user.component";
import { CreateProfileComponentComponent } from "./component/registration/create-profile-component/create-profile-component.component";
import { AccessCodeComponent } from "./component/registration/access-code/access-code.component";

// Shared Components
import { HomeComponent } from "./component/home/home.component";
import { PublicProfileComponent } from "./component/public-profile/public-profile.component";

// Client Component
import { ClientComponent } from './component/client/client.component';
import { ClientProfileComponent } from './component/client/client-profile/client-profile.component';
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

// Employee Component
import { EmployeeComponent } from './component/employee/employee.component';
import { EmployeeProfileComponent } from "./component/employee/employee-profile/employee-profile.component";
import { EmployeeServicesComponent } from "./component/employee/employee-services/provided-service/employee-services.component";
import { EmployeeScheduleComponent } from "./component/employee/employee-schedule/employee-schedule.component";



@NgModule({
  declarations: [

    // Application Component
    AppComponent,

    // Shared Components
    HomeComponent,
    LoginComponent,
    RegisterUserComponent,
    CreateProfileComponentComponent,
    AccessCodeComponent,
    PublicProfileComponent,


    // Client Components
    ClientComponent,
    ClientProfileComponent,
    ClientSearchServicesComponent,
    ClientServiceAndBookingComponent,
    ClientScheduleComponent,
    ClientAppointmentDetailsComponent,

    // Employee Components
    EmployeeComponent,
    EmployeeServicesComponent,
    EmployeeScheduleComponent,
    EmployeeAppointmentDetailsComponent,
    EmployeeProfileComponent,

  ],
  imports: [

    // Required Angular Modules
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,

    // Required Angular Material Modules
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    MatSelectModule,
    MatOptionModule,
    MatTableModule,
    MatSortModule,

    // Router
    AppRoutingModule,

    // Pipes
    LocaleTimePipe,
    LocaleDatePipe,
    AmericanPhoneNumberPipe,
    AmericanFormattedDatePipe,

  ],
  providers: [

    // Http Interceptor
    { provide: HTTP_INTERCEPTORS, useClass: AddTokenInterceptor, multi: true },

    // Application Services
    SalonClient,
    LoginService,
    CredentialService

  ],
  bootstrap: [AppComponent]
})
export class SalonApp { }
