import { Component } from '@angular/core';
import {FormControl} from "@angular/forms";
import {LoginService} from "../../service/login.service";
import {Router} from "@angular/router";
import {BehaviorSubject} from "rxjs";

@Component({
  selector: 'salon-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  /**
   * controls the message displayed on template during login, default is blank
   */
  loginMessage:BehaviorSubject<string> = new BehaviorSubject<string>("");

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
              private router: Router) {
    if (loginService.authenticated) router.navigate(['/user']);
  }


  /**
   * logs in a user using credentials provided in login form
   */
  login(): void { // when the user clicks login...
    // grab username and password from angular forms
    let username = this.usernameForm.value;
    let password = this.passwordForm.value;
    // and begin login attempt
    this.loginService.login(username, password)
      .subscribe((authenticationSuccessful:boolean) => {
        if (authenticationSuccessful) { // on successful authentication reset the forms
          this.usernameForm.reset();
          this.passwordForm.reset();
          // and reroute to user-profile page
          this.router.navigate(['/user'])
        } else { // on authentication failure...
          // provided a helpful message
          this.loginMessage.next("Could not authenticate with provided credentials!");
          // and reset the password form
          this.passwordForm.reset();
        }
      });
  }
}
