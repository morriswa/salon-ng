import { Injectable } from '@angular/core';
import {BehaviorSubject, map, Observable, of, tap} from "rxjs";
import {SalonClient} from "./salon-client.service";

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  clientSchedule$: BehaviorSubject<any[]|undefined> = new BehaviorSubject<any[] | undefined>(undefined);

  constructor(private salonClient: SalonClient) {

  }

  getClientAppointments(): Observable<any[]> {
    const schedule = this.clientSchedule$.getValue();
    if (!schedule) return this.salonClient.getClientSchedule()
      .pipe(tap((res:any[])=>this.clientSchedule$.next(res)));
    return of(schedule);
  }

  getClientAppointment(appointmentId: number): Observable<any> {
    const schedule = this.clientSchedule$.getValue();

    console.log(`looking up ${appointmentId}`)

    if (!schedule)
      return this.salonClient.getClientSchedule()
      .pipe(
        tap((res:any[])=>this.clientSchedule$.next(res)),
        map((res:any[]): any => {
          for (const apt of res) {
            if (Number(apt.appointmentId) === Number(appointmentId)) return apt;
          }
          return undefined;
        }));
    else {
      for (const apt of schedule) {
        if (Number(apt.appointmentId) === Number(appointmentId)) return of(apt);
      }
      return of(undefined);
    }
  }

  refreshClientSchedule() {
    return this.salonClient.getClientSchedule()
      .pipe(tap((res:any[])=>this.clientSchedule$.next(res)));
  }
}
