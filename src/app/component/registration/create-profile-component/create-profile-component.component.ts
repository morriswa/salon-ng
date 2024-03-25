import { Component } from '@angular/core';
import {BehaviorSubject, switchMap} from "rxjs";
import {Router} from "@angular/router";
import {LoginService} from "../../../service/login.service";
import {SalonClient} from "../../../service/salon-client.service";
import {ValidatorFactory} from "../../../validator-factory";
import {ReactiveFormsModule} from "@angular/forms";
import {MatSelectModule} from "@angular/material/select";
import {CommonModule} from "@angular/common";
import {SelectorComponent} from "../../shared/bootstrap-selector/selector.component";

@Component({
  selector: 'salon-create-profile-component',
  templateUrl: './create-profile-component.component.html',
  styleUrl: './create-profile-component.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatSelectModule,
    SelectorComponent,
  ]
})
export class CreateProfileComponentComponent {


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

  pronounOptions: any = [
    {val: 'H', title: 'He/Him/His'},
    {val: 'S', title: 'She/Her/Hers'},
    {val: 'T', title: 'They/Them/Theirs'},
  ];

  contactMethodOptions: any[] = [
    {val: 'Email', title: 'Email'},
    {val: 'PhoneCall', title: 'Phone Call'},
    {val: 'TextMessage', title: 'Text Message'},
  ];

  stateOptions: any[] = [
    { val: 'AL', title:'Alabama'},
    { val: 'AK', title:'Alaska'},
    { val: 'AZ', title:'Arizona'},
    { val: 'AR', title:'Arkansas'},
    { val: 'CA', title:'California'},
    { val: 'CO', title:'Colorado'},
    { val: 'CT', title:'Connecticut'},
    { val: 'DE', title:'Delaware'},
    { val: 'DC', title:'District Of Columbia'},
    { val: 'FL', title:'Florida'},
    { val: 'GA', title:'Georgia'},
    { val: 'HI', title:'Hawaii'},
    { val: 'ID', title:'Idaho'},
    { val: 'IL', title:'Illinois'},
    { val: 'IN', title:'Indiana'},
    { val: 'IA', title:'Iowa'},
    { val: 'KS', title:'Kansas'},
    { val: 'KY', title:'Kentucky'},
    { val: 'LA', title:'Louisiana'},
    { val: 'ME', title:'Maine'},
    { val: 'MD', title:'Maryland'},
    { val: 'MA', title:'Massachusetts'},
    { val: 'MI', title:'Michigan'},
    { val: 'MN', title:'Minnesota'},
    { val: 'MS', title:'Mississippi'},
    { val: 'MO', title:'Missouri'},
    { val: 'MT', title:'Montana'},
    { val: 'NE', title:'Nebraska'},
    { val: 'NV', title:'Nevada'},
    { val: 'NH', title:'New Hampshire'},
    { val: 'NJ', title:'New Jersey'},
    { val: 'NM', title:'New Mexico'},
    { val: 'NY', title:'New York'},
    { val: 'NC', title:'North Carolina'},
    { val: 'ND', title:'North Dakota'},
    { val: 'OH', title:'Ohio'},
    { val: 'OK', title:'Oklahoma'},
    { val: 'OR', title:'Oregon'},
    { val: 'PA', title:'Pennsylvania'},
    { val: 'RI', title:'Rhode Island'},
    { val: 'SC', title:'South Carolina'},
    { val: 'SD', title:'South Dakota'},
    { val: 'TN', title:'Tennessee'},
    { val: 'TX', title:'Texas'},
    { val: 'UT', title:'Utah'},
    { val: 'VT', title:'Vermont'},
    { val: 'VA', title:'Virginia'},
    { val: 'WA', title:'Washington'},
    { val: 'WV', title:'West Virginia'},
    { val: 'WI', title:'Wisconsin'},
    { val: 'WY', title:'Wyoming'},
  ];

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

    console.log(params);

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
          this.router.navigate(['/register2','access'])
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
