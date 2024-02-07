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

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    UserProfileComponent,
    EmployeeComponent,
    ClientComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AddTokenInterceptor, multi: true },
    SalonClient
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
