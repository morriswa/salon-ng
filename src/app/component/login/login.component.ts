import { Component } from '@angular/core';
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {LoginService} from "../../service/login.service";
import {Router, RouterModule} from "@angular/router";
import {BehaviorSubject} from "rxjs";
import {CommonModule} from "@angular/common";
import {ValidatorFactory} from "../../validator-factory";

@Component({
  selector: 'salon-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
  ]
})
export class LoginComponent {

  /**
   * indicates whether the component is in a loading state
   */
  processingLogin$:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  /**
   * controls the message displayed on template during login, default is blank
   */
  loginMessage$:BehaviorSubject<string> = new BehaviorSubject<string>("");

  /**
   * provides username form access and manipulation on login page
   */
  usernameForm: FormControl = ValidatorFactory.getUsernameForm();

  /**
   * provides password form access and manipulation on login page
   */
  passwordForm:FormControl = ValidatorFactory.getPasswordForm();


  constructor(public loginService: LoginService,
              private router: Router) {
    // if the user is already authenticated, they should be re-routed to the appropriate portal
    if (loginService.authenticated) {
      if (loginService.hasAuthority('EMPLOYEE'))
        router.navigate(['/employee','user']);
      else if (loginService.hasAuthority('CLIENT'))
        router.navigate(['/client','user']);
      else router.navigate(['/register2']);
    }

    this.processingLogin$.asObservable().subscribe(locked=>{
      if (locked) { // if the component is processing a request
        // disable relevant components
        this.usernameForm.disable();
        this.passwordForm.disable();
      } else { // enable them again when ready
        this.usernameForm.enable();
        this.passwordForm.enable();
      }
    })
  }


  /**
   * logs in a user using credentials provided in login form
   */
  login(): void { // when the user clicks login...
    this.processingLogin$.next(true); // lock the forms until attempt has been processed
    // grab username and password from angular forms
    let username = this.usernameForm.value;
    let password = this.passwordForm.value;
    // and begin login attempt
    this.loginService.login(username, password)
      .subscribe((authenticationSuccessful:boolean) => {
        if (authenticationSuccessful) { // on successful authentication reset the forms
          this.usernameForm.reset();
          this.passwordForm.reset();
          // and reroute to client-profile page
          if (this.loginService.hasAuthority('EMPLOYEE'))
            this.router.navigate(['/employee']);
          else if (this.loginService.hasAuthority('CLIENT'))
            this.router.navigate(['/client']);
          else this.router.navigate(['/register2']);
        } else { // on authentication failure...
          // provided a helpful message
          this.loginMessage$.next("Could not authenticate with provided credentials!");
          // and reset the password form
          this.passwordForm.reset();
          // unlock the forms
          this.processingLogin$.next(false);
        }
      });
  }
}
