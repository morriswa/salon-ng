import { Injectable } from '@angular/core';
import {BehaviorSubject, map, Observable, of, tap} from "rxjs";
import {SalonClient} from "./salon-client.service";

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  clientAppointments$: BehaviorSubject<any[]|undefined> = new BehaviorSubject<any[] | undefined>(undefined);
  employeeAppointments$: BehaviorSubject<any[]|undefined> = new BehaviorSubject<any[] | undefined>(undefined);

  constructor(private salonClient: SalonClient) { }

  getAppointmentDetailsForClient(appointmentId: number): Observable<any> {
    const schedule = this.clientAppointments$.getValue();

    if (!schedule)
      return this.salonClient.getClientSchedule()
      .pipe(
        tap((res:any[])=>this.clientAppointments$.next(res)),
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

  getAppointmentDetailsForEmployee(appointmentId: number): Observable<any> {
    const schedule = this.employeeAppointments$.getValue();

    if (!schedule)
      return this.salonClient.getEmployeeSchedule()
        .pipe(
          tap((res:any[])=>this.employeeAppointments$.next(res)),
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
      .pipe(tap((res:any[])=>this.clientAppointments$.next(res)));
  }

  refreshEmployeeSchedule() {
    return this.salonClient.getEmployeeSchedule()
      .pipe(tap((res:any[])=>this.employeeAppointments$.next(res)));
  }
}
