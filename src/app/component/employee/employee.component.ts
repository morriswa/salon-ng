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

  /**
   * displays authenticated user's first name on template
   */
  firstName$: Observable<string>;

  // component dependencies
  constructor(private router: Router, public login: LoginService, private salonClient: SalonClient) {
    // if the user has the proper authorities, they may proceed
    // else route them appropriately
    if (!login.authenticated) router.navigate(['/login']);
    else if (!login.hasAuthority('EMPLOYEE')) router.navigate(['/']);

    // retrieve first name
    this.firstName$ = this.salonClient.getEmployeeProfile().pipe(map((res:any)=>res.firstName))
  }

  currentPageIs(page: string) {
    return this.router.routerState.snapshot.url===page;
  }

}
