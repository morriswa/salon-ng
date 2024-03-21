import { Component } from '@angular/core';
import {ActivatedRoute, Router, RouterModule} from "@angular/router";
import {SalonClient} from "../../../service/salon-client.service";
import {BehaviorSubject} from "rxjs";
import {Appointment} from "../../../interface/appointment.interface";
import {CommonModule} from "@angular/common";
import {AmericanPhoneNumberPipe} from "../../../pipe/AmericanPhoneNumber.pipe";
import {LocaleDatePipe} from "../../../pipe/LocaleDate.pipe";
import {LocaleTimePipe} from "../../../pipe/LocaleTime.pipe";

@Component({
  selector: 'salon-client-appointment-details',
  templateUrl: './client-appointment-details.component.html',
  styleUrl: './client-appointment-details.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,

    AmericanPhoneNumberPipe,
    LocaleDatePipe,
    LocaleTimePipe,
  ]
})
export class ClientAppointmentDetailsComponent {

  appointmentDetails$: BehaviorSubject<Appointment|undefined> = new BehaviorSubject<Appointment|undefined>(undefined);

  constructor(active: ActivatedRoute, salonClient: SalonClient, router: Router) {

    const appointmentId = Number(active.snapshot.params['appointmentId']);

    salonClient.getAppointmentDetailsForClient(appointmentId)
    .subscribe({
      next: (appointment:Appointment) => this.appointmentDetails$.next(appointment),
      error: () => router.navigate(['/employee'])
    });

  }
}
