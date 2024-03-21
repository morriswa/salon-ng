import {Component} from '@angular/core';
import {Router, RouterModule} from '@angular/router';
import {LoginService} from "./service/login.service";
import {BehaviorSubject} from "rxjs";
import {CommonModule} from "@angular/common";


/**
 * Core application component loaded before every other page
 * Provides login and routing capabilities to the user
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
export class SalonApplication {

  ready$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  // component dependencies
  constructor(public loginService: LoginService,
              private router: Router) {
    this.loginService.init().subscribe((isAuthenticated)=> {
      console.log("Initialized login service with status " + (isAuthenticated ? "authenticated" : "not authenticated"));
      this.ready$.next(true);
    });
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
