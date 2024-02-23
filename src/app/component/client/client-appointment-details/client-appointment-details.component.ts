import { Component } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {SalonClient} from "../../../service/salon-client.service";
import {BehaviorSubject, Observable} from "rxjs";
import {AppointmentService} from "../../../service/appointment.service";

@Component({
  selector: 'salon-client-appointment-details',
  templateUrl: './client-appointment-details.component.html',
  styleUrl: './client-appointment-details.component.scss'
})
export class ClientAppointmentDetailsComponent {

  appointmentId: number;
  appointmentDetails$: BehaviorSubject<any> = new BehaviorSubject<any>(undefined);

  constructor(active: ActivatedRoute, private schedule: AppointmentService, private router: Router) {

    this.appointmentId = Number(active.snapshot.params['appointmentId']);

    schedule.getAppointmentDetailsForClient(this.appointmentId)
      .subscribe({
      next: appointment => {
        this.appointmentDetails$.next(appointment)
      },
      error: () => this.router.navigate(['/employee'])
    })

  }
}
