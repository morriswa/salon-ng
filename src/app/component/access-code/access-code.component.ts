import { Component } from '@angular/core';
import {FormControl} from "@angular/forms";
import {SalonClient} from "../../service/salon-client.service";
import {LoginService} from "../../service/login.service";
import {ActivatedRoute, Router} from "@angular/router";
import {BehaviorSubject, switchMap} from "rxjs";
import {USER_AUTHORITY} from "../../type-declarations";


@Component({
  selector: 'salon-access-code',
  templateUrl: './access-code.component.html',
  styleUrl: './access-code.component.scss'
})
export class AccessCodeComponent {
  accessCodeForm: FormControl = new FormControl;

  static availableAccessPages = ['client','employee']

  mode!: string;
  accessCodeError$: BehaviorSubject<string> = new BehaviorSubject<string>("");

  constructor(private salonClient: SalonClient, private login: LoginService, route: ActivatedRoute, private router: Router) {
    const desiredMode: string = route.snapshot.params['code'];
    if (!(AccessCodeComponent.availableAccessPages.includes(desiredMode)))
      router.navigate(['/']);
    else if (login.hasAuthority(desiredMode.toUpperCase() as USER_AUTHORITY))
      router.navigate(['/'+desiredMode])
    else
      this.mode = desiredMode;
  }

  enterCode() {
    const enteredCode = this.accessCodeForm.value;

    if (this.mode === 'client')
      this.salonClient.unlockClientPermissions()
        .pipe(switchMap(()=>this.login.init()))
        .subscribe({
          next: ()=>{
            this.router.navigate(['/client'])
          },
          error: err=>this.accessCodeError$.next(err.error.description)
        });
    else if (this.mode === 'employee')
      this.salonClient.unlockEmployeePermissions(enteredCode)
        .pipe(switchMap(()=>this.login.init()))
        .subscribe({
          next: ()=>{
            this.router.navigate(['/employee'])
          },
          error: err=>this.accessCodeError$.next(err.error.description)
        });
    else throw new Error("Not a real action");
  }
}
