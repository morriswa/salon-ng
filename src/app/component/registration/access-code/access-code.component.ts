import { Component } from '@angular/core';
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {SalonClient} from "../../../service/salon-client.service";
import {LoginService} from "../../../service/login.service";
import {ActivatedRoute, Router} from "@angular/router";
import {BehaviorSubject, switchMap} from "rxjs";
import {CommonModule} from "@angular/common";
import {ValidatorFactory} from "../../../validator-factory";


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


  constructor(private salonClient: SalonClient, private login: LoginService, route: ActivatedRoute, private router: Router) {
    if (!login.hasAuthority('USER')) router.navigate(['/register2'])
    else if (!login.hasAuthority('NUSER')) router.navigate(['/'])
  }


  enterCode() {
    const enteredCode = this.accessCodeForm.value;

    this.salonClient.unlockEmployeePermissions(enteredCode)
      .pipe(switchMap(()=>this.login.init()))
      .subscribe({
        next: ()=>{
          this.router.navigate(['/employee'])
        },
        error: err=>this.accessCodeError$.next(err.error.description)
      });
  }

  registerClient() {
    this.salonClient.unlockClientPermissions()
      .pipe(switchMap(()=>this.login.init()))
      .subscribe({
        next: ()=>this.router.navigate(['/client']),
        error: err => console.error(err)
      });
  }

}
