import { Component } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {SalonClient} from "../../../service/salon-client.service";

@Component({
  selector: 'salon-employee-schedule',
  templateUrl: './employee-schedule.component.html',
  styleUrl: './employee-schedule.component.scss'
})
export class EmployeeScheduleComponent {
  employeeSchedule$: BehaviorSubject<any[]|undefined> = new BehaviorSubject<any[] | undefined>(undefined);

  constructor(salonClient: SalonClient) {
    salonClient.getEmployeeSchedule().subscribe({
      next: (res:any[]) => this.employeeSchedule$.next(res)
    });
  }

}
