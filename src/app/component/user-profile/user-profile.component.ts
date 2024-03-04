import { Component } from '@angular/core';
import {BehaviorSubject, switchMap} from 'rxjs';
import { SalonClient } from 'src/app/service/salon-client.service';
import {LoginService} from "../../service/login.service";
import {FormControl, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {UserProfile} from "../../interface/user-profile.interface";

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
  createFormErrors: string[] = [];


  firstNameForm = new FormControl('', [Validators.maxLength(32)]);
  lastNameForm = new FormControl('', [Validators.maxLength(32)]);
  phoneNumberForm = new FormControl('', [
    Validators.minLength(10),
    Validators.maxLength(10),
    Validators.pattern("^[0-9]*$")
  ]);
  emailForm = new FormControl('', Validators.maxLength(100));
  addressLineOneForm = new FormControl('', Validators.maxLength(50))
  addressLineTwoForm = new FormControl('', Validators.maxLength(50))
  cityForm = new FormControl('', Validators.maxLength(50))
  stateForm = new FormControl('', [
    Validators.minLength(2),
    Validators.maxLength(2),
    Validators.pattern("^[A-Z]*$")
  ]);
  zipCodeForm = new FormControl('', [
    Validators.minLength(10),
    Validators.maxLength(10),
    Validators.pattern("^[0-9-]*$")
  ]);


  pronounValue?:string;

  constructor(private router: Router, public login: LoginService, private salonClient: SalonClient) {
    if (!login.authenticated) router.navigate(['/login']);
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
        switchMap(()=>this.login.init()),
        switchMap((authenticationSuccessful: boolean)=>{
          // assuming no errors are encountered, call get user profile endpoint to retrieve updated info
          if (authenticationSuccessful) return this.salonClient.getUserProfile();
          // if the user could not be authenticated, reset
          else {
            this.login.logout();
            return this.router.navigate(['/']);
          }
        })
      )
      .subscribe({
        next: (res:any) => { // if requests were successful
          // this.account$ = this.login.account$; // get new login information
          this.createFormErrors = []; // reset error messages
          this.userProfile$.next(res); // cache profile
          this.resetAllForms(); // reset profile forms
          this.processingProfile$.next(false); // and mark component as available
        },
        error: (err:any) => { // if errors were encountered during profile creation
          this.createFormErrors = []; // reset error messages
          // cache all server error messages and display them to the user
          err.error.additionalInfo.map((each:any)=>this.createFormErrors.push(each.message))
          this.processingProfile$.next(false); // and mark component as available
        }
      });
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
