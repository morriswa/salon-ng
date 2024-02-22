import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AddTokenInterceptor } from './interceptor/AddTokenInterceptor';
import { CommonModule } from '@angular/common';
import { UserProfileComponent } from './component/user-profile/user-profile.component';
import { EmployeeComponent } from './component/employee/employee.component';
import { ClientComponent } from './component/client/client.component';
import { SalonClient } from './service/salon-client.service';
import {HomeComponent} from "./component/home/home.component";
import {RegisterUserComponent} from "./component/register-user/register-user.component";
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
import {MatNativeDateModule} from "@angular/material/core";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterUserComponent,
    UserProfileComponent,
    EmployeeComponent,
    ProvidedServiceComponent,
    EmployeeScheduleComponent,
    EmployeeFinanceComponent,
    // Client Components
    ClientComponent,
    ClientSearchServicesComponent,
    ClientServiceAndBookingComponent
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
    MatNativeDateModule
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
