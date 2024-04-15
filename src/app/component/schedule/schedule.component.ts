import { Component } from '@angular/core';
import {SalonStore} from "../../service/salon-store.service";
import {BehaviorSubject} from "rxjs";
import {CommonModule} from "@angular/common";
import {LocaleTimePipe} from "../../pipe/LocaleTime.pipe";
import {LocaleDatePipe} from "../../pipe/LocaleDate.pipe";
import {PageService} from "../../service/page.service";
import {LoginService} from "../../service/login.service";

@Component({
  selector: 'salon-schedule',
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.scss',
  standalone: true,
  imports: [
    CommonModule,

    LocaleTimePipe,
    LocaleDatePipe,
  ]
})
export class ScheduleComponent {

  mode?: 'employee'|'client';
  schedule$: BehaviorSubject<any[]|undefined> = new BehaviorSubject<any[]|undefined>(undefined);

  constructor(salonStore: SalonStore, public page: PageService, login: LoginService) {
    if (login.hasAuthority('CLIENT')) {
      this.mode = 'client';
      salonStore.getSchedule('client').subscribe({
        next: (res:any[]) => {
          this.schedule$.next(res);
        }
      });
    } else if (login.hasAuthority('EMPLOYEE')) {
      this.mode = 'employee';
      salonStore.getSchedule('employee').subscribe({
        next: (res:any[]) => {
          this.schedule$.next(res);
        }
      });
    } else {
      page.goHome();
    }

  }


}
