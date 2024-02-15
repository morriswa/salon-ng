import { Component } from '@angular/core';
import {FormControl} from "@angular/forms";
import {LoginService} from "../../service/login.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

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
          this.router.navigate(['/user'])
        },
        error: () => { // on authentication failure...
          // provided a helpful message
          this.loginMessage = "Could not authenticate with provided credentials!";
          // and reset the password form
          this.passwordForm.reset();
        }
      });
  }
}
