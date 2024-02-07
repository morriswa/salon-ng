import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
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

  /**
   * controls the message displayed on template during login, default is blank
   */
  loginMessage?:string;

  /**
   * provides username form access and manipulation on login page
   */
  usernameForm: FormControl = new FormControl();

  /**
   * provides password form access and manipulation on login page
   */
  passwordForm:FormControl = new FormControl();


  // component dependencies
  constructor(public loginService: LoginService,
              private router: Router) { }


  /**
   * logs in a user using credentials provided in login form
   */
  login(): void { // when the user clicks login...
    // grab username and password from angular forms
    let username = this.usernameForm.value;
    let password = this.passwordForm.value;
    // and begin login attempt
    this.loginService.login(username, password)
    .subscribe({
      next: (res:any) => { // on successful authentication reset the forms
        console.log(res)
        this.usernameForm.reset();
        this.passwordForm.reset();
      },
      error: () => { // on authentication failure...
        // provided a helpful message
        this.loginMessage = "Could not authenticate with provided credentials!";
        // and reset the password form
        this.passwordForm.reset();
      }
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
    // provide a message confirming logout
    this.loginMessage = "Successfully logged out!";
  }
}
