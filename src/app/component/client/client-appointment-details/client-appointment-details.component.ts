import { Component } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {SalonClient} from "../../../service/salon-client.service";
import {BehaviorSubject} from "rxjs";
import {Appointment} from "../../../interface/appointment.interface";

@Component({
  selector: 'salon-client-appointment-details',
  templateUrl: './client-appointment-details.component.html',
  styleUrl: './client-appointment-details.component.scss'
})
export class ClientAppointmentDetailsComponent {

  appointmentId: number;
  appointmentDetails$: BehaviorSubject<Appointment|undefined> = new BehaviorSubject<Appointment|undefined>(undefined);

  constructor(active: ActivatedRoute, salonClient: SalonClient, router: Router) {

    this.appointmentId = Number(active.snapshot.params['appointmentId']);

    salonClient.getAppointmentDetailsForClient(this.appointmentId)
    .subscribe({
      next: (appointment:Appointment) => this.appointmentDetails$.next(appointment),
      error: () => router.navigate(['/employee'])
    })

  }
}
