import { Component } from '@angular/core';
import {BehaviorSubject, switchMap} from "rxjs";
import {ClientInfo} from "../../../interface/profile.interface";
import {Router} from "@angular/router";
import {LoginService} from "../../../service/login.service";
import {SalonClient} from "../../../service/salon-client.service";
import {ValidatorFactory} from "../../../validator-factory";

@Component({
  selector: 'salon-create-profile-component',
  templateUrl: './create-profile-component.component.html',
  styleUrl: './create-profile-component.component.scss'
})
export class CreateProfileComponentComponent {

  /**
   * state for items that should not be visible if a user profile request is still processing
   */
  processingProfile$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);


  pronounSelector$: BehaviorSubject<string|undefined> = new BehaviorSubject<string | undefined>(undefined);

  createFormErrors: string[] = [];


  firstNameForm = ValidatorFactory.getFirstNameForm();
  lastNameForm = ValidatorFactory.getLastNameForm();
  phoneNumberForm = ValidatorFactory.getPhoneNumberForm();
  emailForm = ValidatorFactory.getEmailForm();
  addressLineOneForm = ValidatorFactory.getAddressLnOneForm();
  addressLineTwoForm = ValidatorFactory.getAddressLnTwoForm();
  cityForm = ValidatorFactory.getCityForm();
  stateForm = ValidatorFactory.getStateForm();
  zipCodeForm = ValidatorFactory.getZipCodeForm();

  pronounValue?:string;

  constructor(private router: Router, public login: LoginService, private salonClient: SalonClient) {
    if (!login.authenticated) router.navigate(['/login']);
    else if (login.hasAuthority('USER')) router.navigate(['/register2','access']);
  }


  createUserProfile() { // when user submits their contact information...
    // mark component as loading so no further changes can be made
    this.processingProfile$.next(true);

    // create response body
    let params:any = {
      firstName: this.firstNameForm.value,
      lastName: this.lastNameForm.value,
      pronouns: this.pronounSelector$.getValue(),
      email: this.emailForm.value,
      phoneNumber: this.phoneNumberForm.value,
      addressLineOne: this.addressLineOneForm.value,
      city: this.cityForm.value,
      stateCode: this.stateForm.value,
      zipCode: this.zipCodeForm.value,
      contactPreference: 'Email'
    };

    if (this.addressLineTwoForm.value) params['addressLineTwo'] = this.addressLineTwoForm.value;

    // after response body has been created, call create user profile endpoint with constructed params
    this.salonClient.createUserProfile(params)
      .pipe(
        // since this action will update a user's credentials, refresh the login cache
        switchMap(()=>this.login.init())
      )
      .subscribe({
        next: (res:any) => { // if requests were successful
          // this.account$ = this.login.account$; // get new login information
          this.createFormErrors = []; // reset error messages
          this.processingProfile$.next(false); // and mark component as available
          this.router.navigate(['/register2','access'])
        },
        error: (err:any) => { // if errors were encountered during profile creation
          this.createFormErrors = []; // reset error messages
          // cache all server error messages and display them to the user
          err.error.additionalInfo.map((each:any)=>this.createFormErrors.push(each.message))
          this.processingProfile$.next(false); // and mark component as available
        }
      });
  }

  selectedPronouns($event: 'H'|'S'|'T') {
    this.pronounSelector$.next($event);
    this.pronounValue = $event;
  }
}
