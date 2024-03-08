import { Component } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {SalonClient} from "../../../service/salon-client.service";
import {Appointment} from "../../../interface/appointment.interface";

@Component({
  selector: 'salon-employee-appointment-details',
  templateUrl: './employee-appointment-details.component.html',
  styleUrl: './employee-appointment-details.component.scss'
})
export class EmployeeAppointmentDetailsComponent {

  appointmentId: number;
  appointmentDetails$: BehaviorSubject<Appointment|undefined> = new BehaviorSubject<Appointment|undefined>(undefined);

  constructor(active: ActivatedRoute, salonClient: SalonClient, private router: Router) {

    this.appointmentId = Number(active.snapshot.params['appointmentId']);

    salonClient.getAppointmentDetailsForEmployee(this.appointmentId)
      .subscribe({
        next: (appointment:Appointment) => {
          this.appointmentDetails$.next(appointment)
        },
        error: () => this.router.navigate(['/employee'])
      })

  }
}
