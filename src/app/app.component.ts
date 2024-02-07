import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SalonService } from './service/salon.service';
import { Router } from '@angular/router';
import {LoginService} from "./service/login.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title = 'salon-project-ng';
  usernameForm: FormControl = new FormControl();
  passwordForm:FormControl = new FormControl();
  message?:string;
  loginMessage?:string;

  constructor(public loginService: LoginService,
              private salonService: SalonService,
              private router: Router) { }


  login() { // when the user clicks login...
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

  logout() { // when user clicks logout
    // initiate logout via service
    this.loginService.logout();
    // navigate back to start
    this.router.navigate([''])
    // provide a message confirming logout
    this.loginMessage = "Successfully logged out!";
  }
}
