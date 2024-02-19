import {Component} from '@angular/core';
import {FormControl} from "@angular/forms";
import {SalonClient} from "../../service/salon-client.service";
import {LoginService} from "../../service/login.service";
import {switchMap} from "rxjs";
import {Router} from "@angular/router";

@Component({
  selector: 'salon-register-user',
  templateUrl: './register-user.component.html',
  styleUrl: './register-user.component.scss'
})
export class RegisterUserComponent {

  usernameForm: FormControl = new FormControl();

  passwordForm: FormControl = new FormControl();

  updateFormErrors: any[] = [];

  loading: boolean = false;



  constructor(private router: Router, private salonClient: SalonClient, private login: LoginService) { }


  registerUser() {
    this.loading = true;

    let username = this.usernameForm.value;
    let password = this.passwordForm.value;

    this.salonClient.registerUser(username, password)
    .pipe(switchMap(()=>this.login.login(username, password)))
    .subscribe({
      next: () => { // if requests were successful
        this.updateFormErrors = []; // reset error messages
        this.usernameForm.reset(); // reset profile forms
        this.passwordForm.reset(); // reset profile forms
        this.router.navigate(['/user']);
        this.loading = false;
      },
      error: (err:any) => { // if errors were encountered during profile creation
        this.updateFormErrors = []; // reset error messages
        // cache all server error messages and display them to the user
        err.error.additionalInfo.map((each:any)=>this.updateFormErrors.push(each.message))
        this.loading = false; // and mark component as available
      }
    });
  }
}
