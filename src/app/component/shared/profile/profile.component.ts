import { Component } from '@angular/core';
import {BehaviorSubject, map, Observable, of, switchMap} from 'rxjs';
import { SalonClient } from 'src/app/service/salon-client.service';
import {LoginService} from "../../../service/login.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ValidatorFactory} from "../../../validator-factory";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {ClientInfo, EmployeeProfile, UserInfo} from "../../../interface/profile.interface";
import {MatDatepickerInputEvent, MatDatepickerModule} from "@angular/material/datepicker";
import {CommonModule} from "@angular/common";
import {AmericanPhoneNumberPipe} from "../../../pipe/AmericanPhoneNumber.pipe";
import { MatSelectModule} from "@angular/material/select";
import {AmericanFormattedDatePipe} from "../../../pipe/AmericanFormattedDate.pipe";
import {MatNativeDateModule} from "@angular/material/core";
import {MatInputModule} from "@angular/material/input";
import {SelectorComponent} from "../bootstrap-selector/selector.component";

/**
 * shared component for clients and employees to manage their stored info
 *
 * @author William A. Morris
 */
@Component({
  selector: 'salon-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,

    MatSelectModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,

    AmericanPhoneNumberPipe,
    AmericanFormattedDatePipe,
    SelectorComponent,
  ]
})
export class ProfileComponent {

  /**
   * state for items that should not be visible if a user profile request is still processing
   */
  processingProfile$: BehaviorSubject<boolean>
    = new BehaviorSubject<boolean>(true);

  /**
   * state for update contact info from
   */
  isUpdatingContactInfo$: BehaviorSubject<boolean>
    = new BehaviorSubject<boolean>(false);

  /**
   * internal component state to track application context
   * @private
   */
  private _profileType: BehaviorSubject<'employee' | 'client' | undefined>
    = new BehaviorSubject<'employee' | 'client' | undefined>(undefined);

  /**
   * state of user profile, and if it has been successfully loaded
   * @private
   */
  private _profile$: BehaviorSubject<EmployeeProfile|ClientInfo|undefined>
    = new BehaviorSubject<EmployeeProfile | ClientInfo| undefined>(undefined);

  /**
   * state for pronoun selection dropdown
   */
  pronounSelector$: BehaviorSubject<string|undefined>
    = new BehaviorSubject<string | undefined>(undefined);

  /**
   * state for contact method selection dropdown
   */
  contactMethodSelector$: BehaviorSubject<string|undefined>
    = new BehaviorSubject<string | undefined>(undefined);

  /**
   * state for birthday selector
   */
  selectedBirthday$: BehaviorSubject<string|undefined>
    = new BehaviorSubject<string | undefined>(undefined);

  /**
   * currently cached profile image to upload
   */
  cachedProfileImage$: BehaviorSubject<File| undefined>
    = new BehaviorSubject<File| undefined>(undefined);

  /**
   * errors encountered doing profile image upload
   */
  profilePhotoErrors$: BehaviorSubject<string>
    = new BehaviorSubject<string>("");

  /**
   * errors encountered doing profile updates
   */
  updateFormErrors$: BehaviorSubject<string[]>
    = new BehaviorSubject<string[]>([]);

  /**
   * all angular form control objects
   */
  firstNameForm = ValidatorFactory.getFirstNameForm();
  lastNameForm = ValidatorFactory.getLastNameForm();
  phoneNumberForm = ValidatorFactory.getPhoneNumberForm();
  emailForm = ValidatorFactory.getEmailForm();
  addressLineOneForm = ValidatorFactory.getAddressLnOneForm();
  addressLineTwoForm = ValidatorFactory.getAddressLnTwoForm();
  cityForm = ValidatorFactory.getCityForm();
  stateForm = ValidatorFactory.getStateForm();
  zipCodeForm = ValidatorFactory.getZipCodeForm();
  profilePhotoUploadForm: FormControl = ValidatorFactory.getGenericForm();
  bioForm: FormControl = ValidatorFactory.getGenericForm();

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


  constructor(route: ActivatedRoute, private router: Router, public login: LoginService, private salonClient: SalonClient) {

    const userType = route.parent?.snapshot.url.toString();
    if (userType)
      this._profileType.next(userType as 'client' | 'employee');
    else router.navigate(['/']);


    if (!login.authenticated)
      router.navigate(['/login']);
    else {
      of('Begin load profile pipe')
        .pipe(
          switchMap(()=>{
            return (
              this._profileType.getValue()==='employee'?
                this.salonClient.getEmployeeProfile()
                :
                this.salonClient.getClientProfile()
            );
          })
        )
      .subscribe({
        next: res =>{
          this._profile$ .next(res);
          this.processingProfile$.next(false);
        },
        error: res=>{
          this.processingProfile$.next(false);
        }
      });
    }
  }

  get contactInfo$(): Observable<UserInfo|undefined> {
    return this._profile$.asObservable();
  }

  get employeeProfile$(): Observable<EmployeeProfile|undefined> {
    return this._profile$.asObservable().pipe(map((res)=>{
      if (this._profileType.getValue()==='employee') {
        return <EmployeeProfile>res;
      }
      return undefined;
    }));
  }

  get clientProfile$(): Observable<ClientInfo|undefined> {
    return this._profile$.asObservable().pipe(map((res)=>{
      if (this._profileType.getValue()==='client') {
        return <ClientInfo>res;
      }
      return undefined;
    }));
  }


  updateContactInfo() { // when user submits updated contact information...
    // mark component as loading so no further changes can be made
    this.processingProfile$.next(true);

    // create response body
    let params:any = {};

    if (this._profileType.getValue()==='employee') {
      // and fill with appropriate params based on user input
      if (this.bioForm.value) params['bio'] = this.bioForm.value;
    } else if (this._profileType.getValue()==='client') {
      if (this.selectedBirthday$.getValue()) params['birthday'] = this.selectedBirthday$.getValue();
    }

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
    of('Begin update profile pipe')
      .pipe(switchMap(()=>{
        return (
          this._profileType.getValue()==='employee'?
            this.salonClient.updateEmployeeProfile(params as EmployeeProfile)
            :
            this.salonClient.updateClientProfile(params as ClientInfo)
          );
      })).subscribe({
        next: (res:any) => { // if requests were successful
          this.updateFormErrors$.next([]); // reset error messages
          this._profile$.next(res); // cache updated profile
          this.resetAllForms(); // reset update profile forms
          this.isUpdatingContactInfo$.next(false); // hide update profile form
          this.processingProfile$.next(false); // and mark component as available
        },
        error: (err:any) => { // if errors were encountered during update profile
          let errors:string[] = []; // reset error messages
          // cache all server error messages and display them to the user
          err.error.additionalInfo.map((each:any)=>errors.push(each.message));
          this.updateFormErrors$.next(errors);
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
    this.pronounSelector$.next(undefined);
    this.contactMethodSelector$.next(undefined);
  }

  selectedBirthday($event: MatDatepickerInputEvent<any, any>) {
    let date = new Date($event.value);

    date.setHours(9)
    date.setMinutes(0);
    date.setSeconds(0);

    const birthdayString = date.toISOString().substring(0, 10);

    this.selectedBirthday$.next(birthdayString);
  }

  uploadProfileImage() {
    const image = this.cachedProfileImage$.getValue();

    if (image)
      this.salonClient.updateEmployeeProfileImage(image)
        .subscribe({
          next: (res:EmployeeProfile)=>{
            this._profile$.next(res);
            this.profilePhotoUploadForm.reset();
          },
          error: (err:any)=>this.profilePhotoErrors$.next(err.error.description)
        });
    else
      this.profilePhotoErrors$.next("No image selected!");
  }

  cacheImageToUpload($event: any) {
    let file:File = $event.target.files[0];
    this.cachedProfileImage$.next(file);
  }
}
