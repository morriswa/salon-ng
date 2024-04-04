import { Component } from '@angular/core';
import {BehaviorSubject, switchMap} from "rxjs";
import {LoginService} from "../../service/login.service";
import {SalonClient} from "../../service/salon-client.service";
import {ValidatorFactory} from "../../validator-factory";
import {ReactiveFormsModule} from "@angular/forms";
import {MatSelectModule} from "@angular/material/select";
import {CommonModule} from "@angular/common";
import {BootstrapSelectorComponent} from "../salon-shared/bootstrap-selector/bootstrap-selector.component";
import {SelectorDeclarations} from "../../selector-declarations";
import {PageService} from "../../service/page.service";

@Component({
  selector: 'salon-create-profile',
  templateUrl: './create-profile.component.html',
  styleUrl: './create-profile.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatSelectModule,
    BootstrapSelectorComponent,
  ]
})
export class CreateProfileComponent {

  protected readonly SelectorDeclarations = SelectorDeclarations;

  /**
   * state for items that should not be visible if a user profile request is still processing
   */
  processingProfile$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  /**
   * state for pronoun selection dropdown
   */
  pronounSelector$: BehaviorSubject<string|undefined>
    = new BehaviorSubject<string | undefined>(undefined);


  selectedState$: BehaviorSubject<string|undefined> = new BehaviorSubject<string | undefined>(undefined);

  /**
   * stores service errors encountered during http requests
   */
  serviceErrors$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);


  firstNameForm = ValidatorFactory.getFirstNameForm();
  lastNameForm = ValidatorFactory.getLastNameForm();
  phoneNumberForm = ValidatorFactory.getPhoneNumberForm();
  emailForm = ValidatorFactory.getEmailForm();
  addressLineOneForm = ValidatorFactory.getAddressLnOneForm();
  addressLineTwoForm = ValidatorFactory.getAddressLnTwoForm();
  cityForm = ValidatorFactory.getCityForm();
  zipCodeForm = ValidatorFactory.getZipCodeForm();

  constructor(private page: PageService, public login: LoginService, private salonClient: SalonClient) {
    if (!login.authenticated) page.change(['/login']);
    else if (login.hasAuthority('USER')) page.change(['/register2','access']);
  }


  createUserProfile() { // when user submits their contact information...
    // mark component as loading so no further changes can be made
    this.processingProfile$.next(true);

    // create response body
    let params:any = {
      firstName: this.firstNameForm.value,
      lastName: this.lastNameForm.value,
      pronouns: this.pronounSelector$.value,
      email: this.emailForm.value,
      phoneNumber: this.phoneNumberForm.value,
      addressLineOne: this.addressLineOneForm.value,
      city: this.cityForm.value,
      stateCode: this.selectedState$.value,
      zipCode: this.zipCodeForm.value,
      // TODO contact pref during signup
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
          this.serviceErrors$.next([]); // reset error messages
          this.processingProfile$.next(false); // and mark component as available
          this.page.change(['/register2','access'])
        },
        error: (err:any) => { // if errors were encountered during profile creation
          let errors:string[] = []; // reset error messages
          // cache all server error messages and display them to the user
          err.error.additionalInfo.map((each:any)=>errors.push(each.message));
          this.serviceErrors$.next(errors);
          this.processingProfile$.next(false); // and mark component as available
        }
      });
  }
}
