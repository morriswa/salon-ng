import { Component } from '@angular/core';
import {SalonStore} from "../../../service/salon-store.service";
import {BehaviorSubject} from "rxjs";
import {Appointment} from "../../../interface/appointment.interface";
import {CommonModule, NgOptimizedImage} from "@angular/common";
import {AmericanPhoneNumberPipe} from "../../../pipe/AmericanPhoneNumber.pipe";
import {LocaleDatePipe} from "../../../pipe/LocaleDate.pipe";
import {LocaleTimePipe} from "../../../pipe/LocaleTime.pipe";
import {PageService} from "../../../service/page.service";
import {ProvidedServiceProfile} from "../../../interface/provided-service.interface";

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
    NgOptimizedImage,
  ]
})
export class ClientAppointmentDetailsComponent {

  appointmentDetails$: BehaviorSubject<Appointment|undefined> = new BehaviorSubject<Appointment|undefined>(undefined);
  serviceProfile$: BehaviorSubject<ProvidedServiceProfile|undefined>
    = new BehaviorSubject<ProvidedServiceProfile|undefined>(undefined);

  constructor(salonStore: SalonStore, public page: PageService) {

    const appointmentId = Number(page.getUrlSegmentOrThrow(2));

    this.appointmentDetails$.asObservable().subscribe(details=>{
      if (details) {
        salonStore.getProvidedServiceProfile(details.serviceId)
          .subscribe({
          next: (serviceDetails)=>this.serviceProfile$.next(serviceDetails)
        })
      }
    })

    salonStore.getAppointmentDetails(appointmentId, 'client')
    .subscribe({
      next: (appointment:Appointment) => this.appointmentDetails$.next(appointment),
      error: () => page.change(['/employee'])
    });
  }
}
