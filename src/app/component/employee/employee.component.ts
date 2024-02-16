import { Component } from '@angular/core';
import {LoginService} from "../../service/login.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.scss'
})
export class EmployeeComponent {


  // component dependencies
  constructor(router: Router, login: LoginService) {
    // if the user has the proper authorities, they may proceed
    if (!login.authenticated) router.navigate(['/login']);
  }

}
