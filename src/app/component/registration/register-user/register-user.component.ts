import {Component} from '@angular/core';
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {SalonClient} from "../../../service/salon-client.service";
import {LoginService} from "../../../service/login.service";
import {BehaviorSubject, switchMap} from "rxjs";
import {Router, RouterModule} from "@angular/router";
import {CommonModule} from "@angular/common";
import {ValidatorFactory} from "../../../validator-factory";

@Component({
  selector: 'salon-register-user',
  templateUrl: './register-user.component.html',
  styleUrl: './register-user.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
  ]
})
export class RegisterUserComponent {

  /**
   * signals whether the component is currently performing a registration request
   */
  processingRegistration$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  /**
   * outputs errors encountered during registration
   */
  registerUserErrors$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  /**
   * controls username form
   */
  usernameForm: FormControl = ValidatorFactory.getUsernameForm();

  /**
   * controls password form
   */
  passwordForm: FormControl = ValidatorFactory.getPasswordForm();


  constructor(private router: Router, private salonClient: SalonClient, private login: LoginService) {
    // if the user is already authenticated, they should be re-routed to the appropriate portal
    if (login.authenticated) {
      if (login.hasAuthority('EMPLOYEE'))
        router.navigate(['/employee','user']);
      else if (login.hasAuthority('CLIENT'))
        router.navigate(['/client','user']);
      else router.navigate(['/register2']);
    }

    this.processingRegistration$.asObservable().subscribe(locked=>{
      if (locked) { // disable forms if component is currently processing a request
        this.usernameForm.disable();
        this.passwordForm.disable();
      } else { // enable after request is complete
        this.usernameForm.enable();
        this.passwordForm.enable();
      }
    })
  }


  registerUser() {
    this.processingRegistration$.next(true);

    let username = this.usernameForm.value;
    let password = this.passwordForm.value;

    this.salonClient.registerUser(username, password)
    .pipe(switchMap(()=>this.login.login(username, password)))
    .subscribe({
      next: () => { // if requests were successful
        this.registerUserErrors$.next([]); // reset error messages
        this.usernameForm.reset(); // reset profile forms
        this.passwordForm.reset(); // reset profile forms
        this.router.navigate(['/register2']);
        this.processingRegistration$.next(false);
      },
      error: (err:any) => { // if errors were encountered during profile creation
        let errors:string[] = []
        // cache all server error messages and display them to the user
        err.error.additionalInfo.map((each:any)=>errors.push(each.message))
        this.registerUserErrors$.next(errors);
        this.processingRegistration$.next(false); // and mark component as available
      }
    });
  }
}