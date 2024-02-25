import { Component } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {SalonClient} from "../../../service/salon-client.service";

@Component({
  selector: 'salon-employee-appointment-details',
  templateUrl: './employee-appointment-details.component.html',
  styleUrl: './employee-appointment-details.component.scss'
})
export class EmployeeAppointmentDetailsComponent {

  appointmentId: number;
  appointmentDetails$: BehaviorSubject<any> = new BehaviorSubject<any>(undefined);

  constructor(active: ActivatedRoute, salonClient: SalonClient, private router: Router) {

    this.appointmentId = Number(active.snapshot.params['appointmentId']);

    salonClient.getAppointmentDetailsForEmployee(this.appointmentId)
      .subscribe({
        next: appointment => {
          this.appointmentDetails$.next(appointment)
        },
        error: () => this.router.navigate(['/employee'])
      })

  }
}
