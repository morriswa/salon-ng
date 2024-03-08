import { Component } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {SalonClient} from "../../../service/salon-client.service";
import {Appointment} from "../../../interface/appointment.interface";

@Component({
  selector: 'salon-employee-schedule',
  templateUrl: './employee-schedule.component.html',
  styleUrl: './employee-schedule.component.scss'
})
export class EmployeeScheduleComponent {
  employeeSchedule$: BehaviorSubject<Appointment[] | undefined> = new BehaviorSubject<Appointment[] | undefined>(undefined);

  constructor(private salonClient: SalonClient) {
    salonClient.getEmployeeSchedule().subscribe({
      next: (res:Appointment[]) => this.employeeSchedule$.next(res)
    });
  }

  refreshEmployeeSchedule() {
    this.salonClient.refreshEmployeeSchedule()
      .subscribe(res=>this.employeeSchedule$.next(res));
  }
}
