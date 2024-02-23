import { Component } from '@angular/core';
import {SalonClient} from "../../../service/salon-client.service";
import {BehaviorSubject} from "rxjs";
import {AppointmentService} from "../../../service/appointment.service";

@Component({
  selector: 'salon-client-schedule',
  templateUrl: './client-schedule.component.html',
  styleUrl: './client-schedule.component.scss'
})
export class ClientScheduleComponent {

  clientSchedule$: BehaviorSubject<any[]|undefined> = new BehaviorSubject<any[] | undefined>(undefined);

  constructor(private schedule: AppointmentService) {
    schedule.refreshClientSchedule().subscribe({
      next: (res:any[]) => this.clientSchedule$.next(res)
    });
  }


}
