import { Component } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {SalonClient} from "../../../service/salon-client.service";
import {Appointment} from "../../../interface/appointment.interface";
import {CommonModule} from "@angular/common";
import {LocaleDatePipe} from "../../../pipe/LocaleDate.pipe";
import {AmericanPhoneNumberPipe} from "../../../pipe/AmericanPhoneNumber.pipe";
import {LocaleTimePipe} from "../../../pipe/LocaleTime.pipe";

@Component({
  selector: 'salon-employee-appointment-details',
  templateUrl: './employee-appointment-details.component.html',
  styleUrl: './employee-appointment-details.component.scss',
  standalone: true,
  imports: [
    CommonModule,

    AmericanPhoneNumberPipe,
    LocaleDatePipe,
    LocaleTimePipe,
  ]
})
export class EmployeeAppointmentDetailsComponent {

  appointmentDetails$: BehaviorSubject<Appointment|undefined> = new BehaviorSubject<Appointment|undefined>(undefined);

  constructor(active: ActivatedRoute, salonClient: SalonClient, private router: Router) {

    const appointmentId = Number(active.snapshot.params['appointmentId']);

    salonClient.getAppointmentDetailsForEmployee(appointmentId)
      .subscribe({
        next: (appointment:Appointment) => {
          this.appointmentDetails$.next(appointment)
        },
        error: () => this.router.navigate(['/employee'])
      })

  }
}
