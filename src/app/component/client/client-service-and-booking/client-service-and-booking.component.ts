import { Component } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {SalonClient} from "../../../service/salon-client.service";
import {BehaviorSubject} from "rxjs";

@Component({
  selector: 'salon-client-service-and-booking',
  templateUrl: './client-service-and-booking.component.html',
  styleUrl: './client-service-and-booking.component.scss'
})
export class ClientServiceAndBookingComponent {

  serviceId: number;
  serviceInfo$: BehaviorSubject<any> = new BehaviorSubject<any>(undefined);

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
