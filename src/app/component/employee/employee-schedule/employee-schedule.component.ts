import { Component } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {SalonClient} from "../../../service/salon-client.service";
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

  constructor(private salonClient: SalonClient, public page: PageService) {
    salonClient.getEmployeeSchedule().subscribe({
      next: (res:Appointment[]) => this.employeeSchedule$.next(res)
    });
  }

  refreshEmployeeSchedule() {
    this.salonClient.refreshEmployeeSchedule()
      .subscribe(res=>this.employeeSchedule$.next(res));
  }
}
