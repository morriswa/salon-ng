import { Component } from '@angular/core';
import {BehaviorSubject, switchMap} from 'rxjs';
import { SalonClient } from 'src/app/service/salon-client.service';
import {LoginService} from "../../service/login.service";
import {FormControl, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {UserProfile} from "../../interface/user-profile.interface";
import {ValidatorFactory} from "../../validator-factory";

@Component({
  selector: 'salon-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent {


  /**
   * state for items that should not be visible if a user profile request is still processing
   */
  processingProfile$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);


  /**
   * state for update contact info from
   */
  isUpdatingContactInfo$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);


  /**
   * state of user profile, and if it has been successfully loaded
   */
  userProfile$: BehaviorSubject<UserProfile|undefined> = new BehaviorSubject<UserProfile | undefined>(undefined);


  pronounSelector$: BehaviorSubject<string|undefined> = new BehaviorSubject<string | undefined>(undefined);

  updateFormErrors: string[] = [];

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
    else if (!(login.hasAuthority('CLIENT')||login.hasAuthority('EMPLOYEE')))
      router.navigate(['/register2'])
    else this.salonClient.getUserProfile().subscribe({
      next: res =>{
        this.userProfile$ .next(res);
        this.processingProfile$.next(false);
      },
      error: res=>{
        this.processingProfile$.next(false);
      }
    });
  }


  updateContactInfo() { // when user submits updated contact information...
    // mark component as loading so no further changes can be made
    this.processingProfile$.next(true);

    // create response body
    let params:any = {};

    // and fill with appropriate params based on user input
    if (this.firstNameForm.value) params['firstName'] = this.firstNameForm.value;

    if (this.lastNameForm.value) params['lastName'] = this.lastNameForm.value;

    if (this.pronounSelector$.getValue()) params['pronouns'] = this.pronounSelector$.getValue();

    if (this.emailForm.value) params['email'] = this.emailForm.value;

    if (this.phoneNumberForm.value) params['phoneNumber'] = this.phoneNumberForm.value;

    if (this.addressLineOneForm.value) params['addressLineOne'] = this.addressLineOneForm.value;

    if (this.addressLineTwoForm.value) params['addressLineTwo'] = this.addressLineTwoForm.value;

    if (this.cityForm.value) params['city'] = this.cityForm.value;

    if (this.stateForm.value) params['stateCode'] = this.stateForm.value;

    if (this.zipCodeForm.value) params['zipCode'] = this.zipCodeForm.value;

    // after response body has been created, call update user profile endpoint with constructed params
    this.salonClient.updateUserProfile(params)
      .subscribe({
        next: (res:any) => { // if requests were successful
          this.updateFormErrors = []; // reset error messages
          this.userProfile$.next(res); // cache updated profile
          this.resetAllForms(); // reset update profile forms
          this.isUpdatingContactInfo$.next(false); // hide update profile form
          this.processingProfile$.next(false); // and mark component as available
        },
        error: (err:any) => { // if errors were encountered during update profile
          this.updateFormErrors = []; // reset error messages
          // cache all server error messages and display them to the user
          err.error.additionalInfo.map((each:any)=>this.updateFormErrors.push(each.message))
          this.processingProfile$.next(false); // and mark component as available
        }
      });
  }

  resetAllForms() {
    this.firstNameForm.reset();
    this.lastNameForm.reset();
    this.phoneNumberForm.reset();
    this.emailForm.reset();
    this.addressLineOneForm.reset()
    this.addressLineTwoForm.reset()
    this.cityForm.reset()
    this.stateForm.reset()
    this.zipCodeForm.reset()
  }


  requestClientAccess() {
    this.salonClient.unlockClientPermissions()
      .subscribe({
        next: ()=>{
          this.router.navigate(['/client'])
        },
        error: err=>console.error(err)
      });
  }

  selectedPronouns($event: 'H'|'S'|'T') {
    this.pronounSelector$.next($event);
    this.pronounValue = $event;
  }
}
