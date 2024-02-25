import { Component } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {SalonClient} from "../../../service/salon-client.service";
import {BehaviorSubject} from "rxjs";

@Component({
  selector: 'salon-client-appointment-details',
  templateUrl: './client-appointment-details.component.html',
  styleUrl: './client-appointment-details.component.scss'
})
export class ClientAppointmentDetailsComponent {

  appointmentId: number;
  appointmentDetails$: BehaviorSubject<any> = new BehaviorSubject<any>(undefined);

  constructor(active: ActivatedRoute, salonClient: SalonClient, router: Router) {

    this.appointmentId = Number(active.snapshot.params['appointmentId']);

    salonClient.getAppointmentDetailsForClient(this.appointmentId)
    .subscribe({
      next: appointment => this.appointmentDetails$.next(appointment),
      error: () => router.navigate(['/employee'])
    })

  }
}
