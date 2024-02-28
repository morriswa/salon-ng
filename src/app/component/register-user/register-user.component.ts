import {Component} from '@angular/core';
import {FormControl} from "@angular/forms";
import {SalonClient} from "../../service/salon-client.service";
import {LoginService} from "../../service/login.service";
import {BehaviorSubject, switchMap} from "rxjs";
import {Router} from "@angular/router";

@Component({
  selector: 'salon-register-user',
  templateUrl: './register-user.component.html',
  styleUrl: './register-user.component.scss'
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
  usernameForm: FormControl = new FormControl({value: '', disabled: true});

  /**
   * controls password form
   */
  passwordForm: FormControl = new FormControl({value: '', disabled: true});


  constructor(private router: Router, private salonClient: SalonClient, private login: LoginService) {
    if (login.authenticated) router.navigate(['/user']);

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
        this.router.navigate(['/user']);
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
