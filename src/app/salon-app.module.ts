import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AddTokenInterceptor } from './interceptor/AddTokenInterceptor';
import { CommonModule } from '@angular/common';
import { UserProfileComponent } from './component/client/user-profile/user-profile.component';
import { EmployeeComponent } from './component/employee/employee.component';
import { ClientComponent } from './component/client/client.component';
import { SalonClient } from './service/salon-client.service';
import {HomeComponent} from "./component/home/home.component";
import {RegisterUserComponent} from "./component/registration/register-user/register-user.component";
import {LoginComponent} from "./component/login/login.component";
import {LoginService} from "./service/login.service";
import {CredentialService} from "./service/credential.service";
import {ProvidedServiceComponent} from "./component/employee/provided-service/provided-service.component";
import {EmployeeScheduleComponent} from "./component/employee/employee-schedule/employee-schedule.component";
import {EmployeeFinanceComponent} from "./component/employee/employee-finance/employee-finance.component";
import {
  ClientSearchServicesComponent
} from "./component/client/client-search-services/client-search-services.component";
import {
  ClientServiceAndBookingComponent
} from "./component/client/client-service-and-booking/client-service-and-booking.component";
import { MatDatepickerModule} from "@angular/material/datepicker";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatNativeDateModule, MatOptionModule} from "@angular/material/core";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatSelectModule} from "@angular/material/select";
import {ClientScheduleComponent} from "./component/client/client-schedule/client-schedule.component";
import {LocaleDatePipe} from "./pipe/AsLocaleDate.pipe";
import {LocaleTimePipe} from "./pipe/AsLocaleTime.pipe";
import {
  ClientAppointmentDetailsComponent
} from "./component/client/client-appointment-details/client-appointment-details.component";
import {AmericanPhoneNumberPipe} from "./pipe/AmericanPhoneNumber";
import {
  EmployeeAppointmentDetailsComponent
} from "./component/employee/employee-appointment-details/employee-appointment-details.component";
import {AccessCodeComponent} from "./component/registration/access-code/access-code.component";
import {MatTableModule} from "@angular/material/table";
import {MatSortModule} from "@angular/material/sort";
import {CreateProfileComponentComponent} from "./component/registration/create-profile-component/create-profile-component.component";
import {EmployeeProfileComponent} from "./component/employee/employee-profile/employee-profile.component";
import {PublicProfileComponent} from "./component/public-profile/public-profile.component";

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterUserComponent,
    CreateProfileComponentComponent,
    AccessCodeComponent,
    PublicProfileComponent,
    UserProfileComponent,
    EmployeeComponent,
    ProvidedServiceComponent,
    EmployeeScheduleComponent,
    EmployeeFinanceComponent,
    EmployeeAppointmentDetailsComponent,
    EmployeeProfileComponent,
    // Client Components
    ClientComponent,
    ClientSearchServicesComponent,
    ClientServiceAndBookingComponent,
    ClientScheduleComponent,
    ClientAppointmentDetailsComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    MatSelectModule,
    MatOptionModule,
    MatTableModule,
    MatSortModule,
    LocaleDatePipe,
    LocaleTimePipe,
    AmericanPhoneNumberPipe
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AddTokenInterceptor, multi: true },
    SalonClient,
    LoginService,
    CredentialService
  ],
  bootstrap: [AppComponent]
})
export class SalonApp { }
