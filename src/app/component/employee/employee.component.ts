import { Component } from '@angular/core';
import {LoginService} from "../../service/login.service";
import {SalonStore} from "../../service/salon-store.service";
import {map, Observable} from "rxjs";
import {CommonModule} from "@angular/common";
import {PageService} from "../../service/page.service";
import {RouterOutlet} from "@angular/router";

@Component({
  selector: 'salon-employee',
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet
  ]
})
export class EmployeeComponent {

  /**
   * displays authenticated user's first name on template
   */
  firstName$?: Observable<string>;

  // component dependencies
  constructor(
    public login: LoginService,
    private salonClient: SalonStore,
    public page: PageService) {
    // route unauthorized users appropriately
    if (!login.authenticated) page.change(['/login']);
    else if (!login.hasAuthority('EMPLOYEE')) page.goHome();
    else { // if the user has the proper authorities, they may proceed
      // retrieve first name
      this.firstName$ = this.salonClient.getCurrentEmployeeProfile().pipe(map((res:any)=>res.firstName));
    }
  }

}
