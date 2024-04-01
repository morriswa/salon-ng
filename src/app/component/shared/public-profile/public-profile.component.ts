import { Component } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {SalonClient} from "../../../service/salon-client.service";
import {BehaviorSubject} from "rxjs";
import {EmployeeProfile} from "../../../interface/profile.interface";
import {AmericanPhoneNumberPipe} from "../../../pipe/AmericanPhoneNumber.pipe";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'salon-public-profile',
  templateUrl: './public-profile.component.html',
  styleUrl: './public-profile.component.scss',
  standalone: true,
  imports: [
    CommonModule,

    AmericanPhoneNumberPipe,
  ]
})
export class PublicProfileComponent {

  employeeInfo$: BehaviorSubject<EmployeeProfile|undefined> = new BehaviorSubject<EmployeeProfile|undefined>(undefined);

  constructor(active: ActivatedRoute, salonClient: SalonClient, router: Router) {
    const employeeId = active.snapshot.params['employeeId'];

    salonClient.getPublicEmployeeProfile(employeeId)
      .subscribe({
        next: (res: EmployeeProfile)=>{
          this.employeeInfo$.next(res);
        },
        error: err => {
          router.navigate(['/'])
        }
      });
  }
}