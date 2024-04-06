import { Component } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {SalonStore} from "../../../service/salon-store.service";
import {Appointment} from "../../../interface/appointment.interface";
import {CommonModule} from "@angular/common";
import {LocaleDatePipe} from "../../../pipe/LocaleDate.pipe";
import {LocaleTimePipe} from "../../../pipe/LocaleTime.pipe";
import {PageService} from "../../../service/page.service";

@Component({
  selector: 'salon-employee-schedule',
  templateUrl: './employee-schedule.component.html',
  styleUrl: './employee-schedule.component.scss',
  standalone: true,
  imports: [
    CommonModule,

    LocaleDatePipe,
    LocaleTimePipe,
  ]
})
export class EmployeeScheduleComponent {


  employeeSchedule$: BehaviorSubject<Appointment[] | undefined> = new BehaviorSubject<Appointment[] | undefined>(undefined);

  constructor(private salonStore: SalonStore, public page: PageService) {
    salonStore.getSchedule('employee').subscribe({
      next: (res:Appointment[]) => this.employeeSchedule$.next(res)
    });
  }

  refreshEmployeeSchedule() {
    this.salonStore.refreshAndRetrieveSchedule('employee')
      .subscribe(res=>this.employeeSchedule$.next(res));
  }
}
