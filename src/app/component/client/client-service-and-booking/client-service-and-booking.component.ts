import { Component } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {SalonClient} from "../../../service/salon-client.service";
import {BehaviorSubject} from "rxjs";
import {MatDatepickerInputEvent} from "@angular/material/datepicker";

@Component({
  selector: 'salon-client-service-and-booking',
  templateUrl: './client-service-and-booking.component.html',
  styleUrl: './client-service-and-booking.component.scss'
})
export class ClientServiceAndBookingComponent {

  serviceId: number;
  serviceInfo$: BehaviorSubject<any> = new BehaviorSubject<any>(undefined);

  availableTimes$: BehaviorSubject<any[]|undefined> = new BehaviorSubject<any[] | undefined>(undefined);

  chosenDateTime$: BehaviorSubject<any|undefined> = new BehaviorSubject<any|undefined>(undefined);

  errorMessageOnBook$: BehaviorSubject<string> = new BehaviorSubject<string>("");
  appointmentConfirmation$: BehaviorSubject<any|undefined> = new BehaviorSubject<any|undefined>(undefined);

  constructor(active: ActivatedRoute, private salonClient: SalonClient, private router: Router) {
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

  selectedDate($event: MatDatepickerInputEvent<any, any>) {
    let date: Date = $event.value;

    let currentTime = new Date();

    date.setHours(currentTime.getHours())
    date.setMinutes(currentTime.getMinutes());
    date.setSeconds(0);

    let currentService = this.serviceInfo$.getValue();

    let request = {
      serviceId: currentService.serviceId,
      employeeId: currentService.employee.employeeId,
      searchDate: date.toISOString()
    }

    console.log(request)
    this.salonClient.getAvailableAppointmentTimes(request)
      .subscribe({
        next: (value:any[]) => this.availableTimes$.next(value),
        error: () => this.availableTimes$.next([])
      });

  }

  formatAsString(time: string) {
    const date = new Date(time);
    return date.toLocaleString();
  }

  formatAsTimeString(time: string) {
    const date = new Date(time);
    return date.toLocaleTimeString();
  }

  selectTime($event: any) {
    this.chosenDateTime$.next($event);
  }

  bookAppointment(dateTime: {time:string; length:number;}) {
    console.log(dateTime);

    let currentService = this.serviceInfo$.getValue();


    let request = {
      employeeId: currentService.employee.employeeId,
      serviceId: this.serviceId,
      time: dateTime.time
    };

    this.salonClient.bookAppointment(request)
      .subscribe({
        next: () => {
          this.appointmentConfirmation$.next(dateTime)
        },
        error: (err:any) => this.errorMessageOnBook$.next(err.error.message)
      });
  }
}
