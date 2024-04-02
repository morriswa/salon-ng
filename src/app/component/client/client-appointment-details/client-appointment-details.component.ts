import { Component } from '@angular/core';
import {SalonClient} from "../../../service/salon-client.service";
import {BehaviorSubject} from "rxjs";
import {Appointment} from "../../../interface/appointment.interface";
import {CommonModule} from "@angular/common";
import {AmericanPhoneNumberPipe} from "../../../pipe/AmericanPhoneNumber.pipe";
import {LocaleDatePipe} from "../../../pipe/LocaleDate.pipe";
import {LocaleTimePipe} from "../../../pipe/LocaleTime.pipe";
import {PageService} from "../../../service/page.service";

@Component({
  selector: 'salon-client-appointment-details',
  templateUrl: './client-appointment-details.component.html',
  styleUrl: './client-appointment-details.component.scss',
  standalone: true,
  imports: [
    CommonModule,

    AmericanPhoneNumberPipe,
    LocaleDatePipe,
    LocaleTimePipe,
  ]
})
export class ClientAppointmentDetailsComponent {

  appointmentDetails$: BehaviorSubject<Appointment|undefined> = new BehaviorSubject<Appointment|undefined>(undefined);

  constructor(salonClient: SalonClient, public page: PageService) {

    const appointmentId = Number(page.getUrlAt(2));

    salonClient.getAppointmentDetailsForClient(appointmentId)
    .subscribe({
      next: (appointment:Appointment) => this.appointmentDetails$.next(appointment),
      error: () => page.change(['/employee'])
    });

  }
}
