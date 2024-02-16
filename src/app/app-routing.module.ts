import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeComponent } from './component/employee/employee.component';
import { ClientComponent } from './component/client/client.component';
import { UserProfileComponent } from './component/user-profile/user-profile.component';
import {HomeComponent} from "./component/home/home.component";
import {RegisterUserComponent} from "./component/register-user/register-user.component";
import {LoginComponent} from "./component/login/login.component";

const routes: Routes = [
  { path:'employee', component: EmployeeComponent },
  { path:'client', component: ClientComponent },
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
