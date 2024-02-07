import { Component } from '@angular/core';
import { CredentialService } from 'src/app/service/credential.service';
import {LoginService} from "../../service/login.service";
import {SalonClient} from "../../service/salon-client.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.scss'
})
export class EmployeeComponent {

  /**
   * controls whether the user is authorized to see the current page
   */
  authorized = false;


  // component dependencies
  constructor(router: Router, login: LoginService) {
    // if the user has the proper authorities, they may proceed
    if (login.hasAuthority("EMPLOYEE")) this.authorized = true;
    // if not redirect the user to home page
    else router.navigate(['']);
  }

}
