import { Component } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {AppointmentService} from "../../../service/appointment.service";

@Component({
  selector: 'salon-employee-schedule',
  templateUrl: './employee-schedule.component.html',
  styleUrl: './employee-schedule.component.scss'
})
export class EmployeeScheduleComponent {
  employeeSchedule$: BehaviorSubject<any[]|undefined> = new BehaviorSubject<any[] | undefined>(undefined);

  constructor(private schedule: AppointmentService) {
    schedule.refreshEmployeeSchedule().subscribe({
      next: (res:any[]) => this.employeeSchedule$.next(res)
    });
  }

}
