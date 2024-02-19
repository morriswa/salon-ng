import { Component } from '@angular/core';
import {LoginService} from "../../service/login.service";
import {Router} from "@angular/router";
import {SalonClient} from "../../service/salon-client.service";
import {map, Observable} from "rxjs";

@Component({
  selector: 'salon-employee',
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.scss'
})
export class EmployeeComponent {

  firstName$: Observable<string>;

  // component dependencies
  constructor(router: Router, public login: LoginService, private salonClient: SalonClient) {
    // if the user has the proper authorities, they may proceed
    if (!login.authenticated) router.navigate(['/login']);
    if (!login.hasAuthority('EMPLOYEE')) router.navigate(['/']);

    this.firstName$ = this.salonClient.getUserProfile().pipe(map((res:any)=>res.firstName))
  }

}
