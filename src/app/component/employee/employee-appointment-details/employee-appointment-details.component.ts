import { Component } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {SalonClient} from "../../../service/salon-client.service";
import {Appointment} from "../../../interface/appointment.interface";
import {CommonModule} from "@angular/common";
import {LocaleDatePipe} from "../../../pipe/LocaleDate.pipe";
import {AmericanPhoneNumberPipe} from "../../../pipe/AmericanPhoneNumber.pipe";
import {LocaleTimePipe} from "../../../pipe/LocaleTime.pipe";
import {PageService} from "../../../service/page.service";

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

  constructor(salonClient: SalonClient, page: PageService) {

    const appointmentId = Number(page.getUrlAt(2));

    salonClient.getAppointmentDetailsForEmployee(appointmentId)
      .subscribe({
        next: (appointment:Appointment) => {
          this.appointmentDetails$.next(appointment)
        },
        error: () => page.change(['/employee'])
      })

  }
}
