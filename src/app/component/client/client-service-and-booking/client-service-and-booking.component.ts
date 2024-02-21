import { Component } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {SalonClient} from "../../../service/salon-client.service";
import {Subject} from "rxjs";

@Component({
  selector: 'salon-client-service-and-booking',
  templateUrl: './client-service-and-booking.component.html',
  styleUrl: './client-service-and-booking.component.scss'
})
export class ClientServiceAndBookingComponent {

  serviceId: number;
  serviceInfo$: Subject<any> = new Subject<any>();

  constructor(active: ActivatedRoute, private salonClient: SalonClient, router: Router) {
    this.serviceId = active.snapshot.params['serviceId'];

    salonClient.getProvidedServiceDetailsForClient(this.serviceId)
      .subscribe({
        next: res=>{
          this.serviceInfo$.next(res);
        },
        error: err => {
          router.navigate(['/client','services'])
        }
      });
  }

}
