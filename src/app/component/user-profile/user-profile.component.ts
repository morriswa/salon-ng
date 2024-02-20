import { Component } from '@angular/core';
import {of, switchMap} from 'rxjs';
import { SalonClient } from 'src/app/service/salon-client.service';
import {LoginService} from "../../service/login.service";
import {FormControl, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {UserAccount} from "../../interface/user-account.interface";
import {UserProfile} from "../../interface/user-profile.interface";

@Component({
  selector: 'salon-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent {

  loading: boolean = true;
  isUpdatingContactInfo: boolean = false;

  account: UserAccount;
  userProfile?: UserProfile;

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



  constructor(private router: Router, public login: LoginService, private salonClient: SalonClient) {
    if (!login.authenticated) router.navigate(['/login']);
    this.account = this.login.account;
    this.salonClient.getUserProfile().subscribe({
      next: res =>{
        this.userProfile = res;
        this.loading = false;
      },
      error: res=>{
        this.loading = false;
      }
    });
  }


  updateContactInfo() { // when user submits updated contact information...
    // mark component as loading so no further changes can be made
    this.loading = true;

    // create response body
    let params:any = {};

    // and fill with appropriate params based on user input
    if (this.firstNameForm.value) params['firstName'] = this.firstNameForm.value;

    if (this.lastNameForm.value) params['lastName'] = this.lastNameForm.value;

    if (this.emailForm.value) params['email'] = this.emailForm.value;

    if (this.phoneNumberForm.value) params['phoneNumber'] = this.phoneNumberForm.value;

    if (this.addressLineOneForm.value) params['addressLineOne'] = this.addressLineOneForm.value;

    if (this.addressLineTwoForm.value) params['addressLineTwo'] = this.addressLineTwoForm.value;

    if (this.cityForm.value) params['city'] = this.cityForm.value;

    if (this.stateForm.value) params['stateCode'] = this.stateForm.value;

    if (this.zipCodeForm.value) params['zipCode'] = this.zipCodeForm.value;

    // after response body has been created, call update user profile endpoint with constructed params
    this.salonClient.updateUserProfile(params)
      // assuming no errors are encountered, immediately call get user profile endpoint to retrieve updated info
      .pipe(switchMap(()=>this.salonClient.getUserProfile()))
      .subscribe({
        next: (res:any) => { // if requests were successful
          this.updateFormErrors = []; // reset error messages
          this.userProfile = res; // cache updated profile
          this.resetAllForms(); // reset update profile forms
          this.isUpdatingContactInfo = false; // hide update profile form
          this.loading = false; // and mark component as available
        },
        error: (err:any) => { // if errors were encountered during update profile
          this.updateFormErrors = []; // reset error messages
          // cache all server error messages and display them to the user
          err.error.additionalInfo.map((each:any)=>this.updateFormErrors.push(each.message))
          this.loading = false; // and mark component as available
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
    this.loading = true;

    // create response body
    let params:any = {
      firstName: this.firstNameForm.value,
      lastName: this.lastNameForm.value,
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
            this.router.navigate(['/']);
            return of();
          }
        })
      )
      .subscribe({
        next: (res:any) => { // if requests were successful
          this.account = this.login.account; // get new login information
          this.createFormErrors = []; // reset error messages
          this.userProfile = res; // cache profile
          this.resetAllForms(); // reset profile forms
          this.loading = false; // and mark component as available
        },
        error: (err:any) => { // if errors were encountered during profile creation
          this.createFormErrors = []; // reset error messages
          // cache all server error messages and display them to the user
          err.error.additionalInfo.map((each:any)=>this.createFormErrors.push(each.message))
          this.loading = false; // and mark component as available
        }
      });
  }
}
