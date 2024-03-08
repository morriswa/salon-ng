import { Component } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {SalonClient} from "../../service/salon-client.service";
import {BehaviorSubject} from "rxjs";

@Component({
  selector: 'salon-public-profile',
  templateUrl: './public-profile.component.html',
  styleUrl: './public-profile.component.scss'
})
export class PublicProfileComponent {

  employeeId: number;
  employeeInfo$: BehaviorSubject<any|undefined> = new BehaviorSubject<any|undefined>(undefined);

  constructor(active: ActivatedRoute, private salonClient: SalonClient, private router: Router) {
    this.employeeId = active.snapshot.params['employeeId'];

    salonClient.getPublicEmployeeProfile(this.employeeId)
      .subscribe({
        next: res=>{
          this.employeeInfo$.next(res);
        },
        error: err => {
          router.navigate(['/'])
        }
      });
  }
}
