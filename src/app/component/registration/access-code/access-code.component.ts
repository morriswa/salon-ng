import { Component } from '@angular/core';
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {SalonClient} from "../../../service/salon-client.service";
import {LoginService} from "../../../service/login.service";
import {BehaviorSubject, switchMap} from "rxjs";
import {CommonModule} from "@angular/common";
import {ValidatorFactory} from "../../../validator-factory";
import {PageService} from "../../../service/page.service";


@Component({
  selector: 'salon-access-code',
  templateUrl: './access-code.component.html',
  styleUrl: './access-code.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ]
})
export class AccessCodeComponent {

  accessCodeError$: BehaviorSubject<string> = new BehaviorSubject<string>("");

  showEmployeeRegistrationForm$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  showClientRegistrationForm$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  accessCodeForm: FormControl = ValidatorFactory.getGenericForm();


  constructor(private salonClient: SalonClient, private login: LoginService, private page: PageService) {
    if (!login.hasAuthority('USER')) page.change(['/register2'])
    else if (!login.hasAuthority('NUSER')) page.goHome();
  }


  enterCode() {
    const enteredCode = this.accessCodeForm.value;

    this.salonClient.unlockEmployeePermissions(enteredCode)
      .pipe(switchMap(()=>this.login.init()))
      .subscribe({
        next: ()=>{
          this.page.change(['/employee'])
        },
        error: err=>this.accessCodeError$.next(err.error.description)
      });
  }

  registerClient() {
    this.salonClient.unlockClientPermissions()
      .pipe(switchMap(()=>this.login.init()))
      .subscribe({
        next: ()=>this.page.change(['/client']),
        error: err => console.error(err)
      });
  }

}
