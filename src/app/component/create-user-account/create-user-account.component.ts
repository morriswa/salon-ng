import {Component} from '@angular/core';
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {SalonStore} from "../../service/salon-store.service";
import {LoginService} from "../../service/login.service";
import {BehaviorSubject, switchMap} from "rxjs";
import {CommonModule} from "@angular/common";
import {ValidatorFactory} from "../../validator-factory";
import {PageService} from "../../service/page.service";

@Component({
  selector: 'salon-create-user-account',
  templateUrl: './create-user-account.component.html',
  styleUrl: './create-user-account.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ]
})
export class CreateUserAccountComponent {

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


  constructor(public page: PageService, private salonStore: SalonStore, private login: LoginService) {
    // if the user is already authenticated, they should be re-routed to the appropriate portal
    if (login.authenticated) {
      if (login.hasAuthority('EMPLOYEE'))
        page.change(['/employee','user']);
      else if (login.hasAuthority('CLIENT'))
        page.change(['/client','user']);
      else page.change(['/register2']);
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

    this.salonStore.registerUser(username, password)
    .pipe(switchMap(()=>this.login.login(username, password)))
    .subscribe({
      next: () => { // if requests were successful
        this.registerUserErrors$.next([]); // reset error messages
        this.usernameForm.reset(); // reset profile forms
        this.passwordForm.reset(); // reset profile forms
        this.page.change(['/register2']);
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
