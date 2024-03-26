// ng
import {Component, OnInit} from '@angular/core';
import {CommonModule} from "@angular/common";
import {Router, RouterModule} from '@angular/router';
// other
import {BehaviorSubject} from "rxjs";
// services
import {LoginService} from "./service/login.service";


/**
 * Core application component loaded before every other page.
 * Provides login and routing capabilities to the user.
 *
 * @author William A. Morris
 * @since 2024-02-02
 */
@Component({
  selector: 'salon-application',
  templateUrl: './salon-application.component.html',
  styleUrls: ['./salon-application.component.scss'],
  standalone: true,
  imports: [
    // Required Angular Modules
    CommonModule,
    RouterModule,
  ]
})
export class SalonApplication implements OnInit {

  /**
   * state det. if application can be displayed
   */
  ready$: BehaviorSubject<boolean>;


  constructor(public loginService: LoginService,
              private router: Router) {
    this.ready$ = new BehaviorSubject<boolean>(false);
  }


  ngOnInit(): void {
    this.loginService.init() // initialize the login service
      // application is ready after login service is initialized
      .subscribe(() => this.ready$.next(true));
  }


  /**
   * logs a user out of the application
   */
  logout(): void { // when user clicks logout
    // navigate back to start
    this.router.navigate(['/'])
    // initiate logout via service
    this.loginService.logout();
  }

}
