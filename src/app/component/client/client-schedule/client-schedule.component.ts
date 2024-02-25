import { Component } from '@angular/core';
import {SalonClient} from "../../../service/salon-client.service";
import {BehaviorSubject} from "rxjs";

@Component({
  selector: 'salon-client-schedule',
  templateUrl: './client-schedule.component.html',
  styleUrl: './client-schedule.component.scss'
})
export class ClientScheduleComponent {

  clientSchedule$: BehaviorSubject<any[]|undefined> = new BehaviorSubject<any[]|undefined>(undefined);

  constructor(salonClient: SalonClient) {
    salonClient.getClientSchedule().subscribe({
      next: (res:any[]) => this.clientSchedule$.next(res)
    });
  }


}
