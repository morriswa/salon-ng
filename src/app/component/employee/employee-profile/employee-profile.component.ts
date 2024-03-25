import { Component } from '@angular/core';
import {BehaviorSubject, switchMap} from 'rxjs';
import { SalonClient } from 'src/app/service/salon-client.service';
import {LoginService} from "../../../service/login.service";
import {Router} from "@angular/router";
import {ValidatorFactory} from "../../../validator-factory";
import {FormControl} from "@angular/forms";
import {EmployeeProfile} from "../../../interface/profile.interface";

@Component({
  selector: 'salon-client-profile',
  templateUrl: './employee-profile.component.html',
  styleUrl: './employee-profile.component.scss'
})
export class EmployeeProfileComponent {


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
  employeeProfile$: BehaviorSubject<EmployeeProfile|undefined> = new BehaviorSubject<EmployeeProfile | undefined>(undefined);


  pronounSelector$: BehaviorSubject<string|undefined> = new BehaviorSubject<string | undefined>(undefined);


  contactMethodSelector$: BehaviorSubject<string|undefined> = new BehaviorSubject<string | undefined>(undefined);


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
  bioForm: FormControl = new FormControl('');
  contactMethodValue?: string;

  constructor(private router: Router, public login: LoginService, private salonClient: SalonClient) {
    if (!login.authenticated)
      router.navigate(['/login']);
    else this.salonClient.getEmployeeProfile().subscribe({
      next: res =>{
        this.employeeProfile$ .next(res);
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
    if (this.bioForm.value) params['bio'] = this.bioForm.value;

    if (this.firstNameForm.value) params['firstName'] = this.firstNameForm.value;

    if (this.lastNameForm.value) params['lastName'] = this.lastNameForm.value;

    if (this.pronounSelector$.getValue()) params['pronouns'] = this.pronounSelector$.getValue();

    if (this.emailForm.value) params['email'] = this.emailForm.value;

    if (this.phoneNumberForm.value) params['phoneNumber'] = this.phoneNumberForm.value;

    if (this.contactMethodSelector$.getValue()) params['contactPreference'] = this.contactMethodSelector$.getValue();

    if (this.addressLineOneForm.value) params['addressLineOne'] = this.addressLineOneForm.value;

    if (this.addressLineTwoForm.value) params['addressLineTwo'] = this.addressLineTwoForm.value;

    if (this.cityForm.value) params['city'] = this.cityForm.value;

    if (this.stateForm.value) params['stateCode'] = this.stateForm.value;

    if (this.zipCodeForm.value) params['zipCode'] = this.zipCodeForm.value;


    // after response body has been created, call update user profile endpoint with constructed params
    this.salonClient.updateEmployeeProfile(params)
      .subscribe({
        next: (res:any) => { // if requests were successful
          this.updateFormErrors = []; // reset error messages
          this.employeeProfile$.next(res); // cache updated profile
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

  selectedPronouns($event: 'H'|'S'|'T') {
    this.pronounSelector$.next($event);
    this.pronounValue = $event;
  }

  selectedContactMethod($event: string) {
    this.contactMethodSelector$.next($event);
    this.contactMethodValue = $event;
  }
}
