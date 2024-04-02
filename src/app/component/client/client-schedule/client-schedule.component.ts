import { Component } from '@angular/core';
import {SalonClient} from "../../../service/salon-client.service";
import {BehaviorSubject} from "rxjs";
import {CommonModule} from "@angular/common";
import {LocaleTimePipe} from "../../../pipe/LocaleTime.pipe";
import {LocaleDatePipe} from "../../../pipe/LocaleDate.pipe";
import {PageService} from "../../../service/page.service";

@Component({
  selector: 'salon-client-schedule',
  templateUrl: './client-schedule.component.html',
  styleUrl: './client-schedule.component.scss',
  standalone: true,
  imports: [
    CommonModule,

    LocaleTimePipe,
    LocaleDatePipe,
  ]
})
export class ClientScheduleComponent {

  clientSchedule$: BehaviorSubject<any[]|undefined> = new BehaviorSubject<any[]|undefined>(undefined);

  constructor(salonClient: SalonClient, public page: PageService) {
    salonClient.getClientSchedule().subscribe({
      next: (res:any[]) => this.clientSchedule$.next(res)
    });
  }


}
