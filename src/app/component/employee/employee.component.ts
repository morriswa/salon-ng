import { Component } from '@angular/core';
import { CredentialService } from 'src/app/service/credential.service';
import {LoginService} from "../../service/login.service";
import {SalonService} from "../../service/salon.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.scss'
})
export class EmployeeComponent {

  authorized = false;

  constructor(router: Router, private login: LoginService) {
    if (login.hasAuthority("EMPLOYEE")) this.authorized = true;
    else router.navigate(['']);
  }

}
