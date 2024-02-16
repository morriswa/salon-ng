import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {LoginService} from "./service/login.service";


/**
 * Core application component loaded on every child page
 * Provides login and routing capabilities to the user
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  loading = true

  // component dependencies
  constructor(public loginService: LoginService,
              private router: Router) {
    this.loginService.init().subscribe({
      next: (isAuthenticated)=>{
        console.log("Initialized login service with status " + (isAuthenticated? "authenticated" : "not authenticated"));
        this.loading = false
      },
    });
  }

  /**
   * logs a user out of the application
   */
  logout(): void { // when user clicks logout
    // initiate logout via service
    this.loginService.logout();
    // navigate back to start
    this.router.navigate([''])
  }
}
