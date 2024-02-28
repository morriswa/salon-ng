import {Component} from '@angular/core';
import { Router } from '@angular/router';
import {LoginService} from "./service/login.service";
import {BehaviorSubject} from "rxjs";


/**
 * Core application component loaded before every other page
 * Provides login and routing capabilities to the user
 */
@Component({
  selector: 'salon-application',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

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
