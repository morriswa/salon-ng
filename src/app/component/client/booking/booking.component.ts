import { Component } from '@angular/core';
import {SalonStore} from "../../../service/salon-store.service";
import {BehaviorSubject} from "rxjs";
import {MatDatepickerInputEvent, MatDatepickerModule} from "@angular/material/datepicker";
import {CommonModule, NgOptimizedImage} from "@angular/common";
import {MatSelectModule} from "@angular/material/select";
import {MoneyPipe} from "../../../pipe/Money.pipe";
import {MatInput} from "@angular/material/input";
import {MatNativeDateModule} from "@angular/material/core";
import {PageService} from "../../../service/page.service";

@Component({
  selector: 'salon-booking',
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.scss',
  standalone: true,
  imports: [
    CommonModule,

    MatSelectModule,
    MatInput,
    MatDatepickerModule,
    MatNativeDateModule,

    MoneyPipe,
    NgOptimizedImage,
  ]
})
export class BookingComponent {

  serviceInfo$: BehaviorSubject<any> = new BehaviorSubject<any>(undefined);

  availableTimes$: BehaviorSubject<any[]|undefined> = new BehaviorSubject<any[] | undefined>(undefined);

  chosenDateTime$: BehaviorSubject<any|undefined> = new BehaviorSubject<any|undefined>(undefined);

  errorMessageOnBook$: BehaviorSubject<string> = new BehaviorSubject<string>("");

  appointmentConfirmation$: BehaviorSubject<any|undefined> = new BehaviorSubject<any|undefined>(undefined);

  constructor(private salonStore: SalonStore, public page: PageService) {
    const serviceId = Number(page.getUrlSegmentOrThrow(2));

    salonStore.getProvidedServiceProfile(serviceId)
      .subscribe({
        next: res=>{
          this.serviceInfo$.next(res);
        },
        error: err => {
          page.change(['/client','services'])
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
    this.salonStore.getAvailableAppointmentTimes(request)
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
      serviceId: this.serviceInfo$.getValue().serviceId,
      time: dateTime.time
    };

    this.salonStore.bookAppointment(request)
      .subscribe({
        next: () => {
          this.appointmentConfirmation$.next(dateTime)
        },
        error: (err:any) => this.errorMessageOnBook$.next(err.error.message)
      });
  }
}
