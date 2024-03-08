import {HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {BehaviorSubject, map, Observable, of, switchMap, tap} from 'rxjs';
import {environment} from "../../environments/environment";
import {UserAccount} from "../interface/user-account.interface";
import {ClientInfo, EmployeeInfo, EmployeeProfile} from "../interface/profile.interface";
import {ProvidedService} from "../interface/provided-service.interface";
import {Appointment} from "../interface/appointment.interface";


/**
 * An HTTP Client responsible for consuming the REST API provided by our Salon Web Service
 */
@Injectable({
  providedIn: 'root'
})
export class SalonClient {

  private SERVICE_URL = environment.webService.path;

  clientProfile$!: BehaviorSubject<ClientInfo|undefined>;
  employeeProfile$!: BehaviorSubject<EmployeeProfile|undefined>;
  employeeServices$!: BehaviorSubject<ProvidedService[]|undefined>;
  clientAppointments$!: BehaviorSubject<Appointment[]|undefined>;
  employeeAppointments$!: BehaviorSubject<Appointment[]|undefined>;

  constructor(private http: HttpClient) {
    this.resetCache();
  }

  resetCache() {

    this.clientProfile$ = new BehaviorSubject<ClientInfo | undefined>(undefined);

    this.employeeProfile$ = new BehaviorSubject<EmployeeProfile | undefined>(undefined);

    this.employeeServices$ = new BehaviorSubject<ProvidedService[] | undefined>(undefined);

    this.clientAppointments$ = new BehaviorSubject<any[] | undefined>(undefined);

    this.employeeAppointments$ = new BehaviorSubject<any[] | undefined>(undefined);
  }

  healthCheck() {
    return this.http.get(`${this.SERVICE_URL}/health`)
    .pipe(map((res:any)=>res.message));
  }

  registerUser(username: string, password: string) {
    return this.http.post(`${this.SERVICE_URL}/register`, {
      username: username,
      password: password
    });
  }

  login(): Observable<UserAccount> {
    return this.http.get(`${this.SERVICE_URL}/login`)
    .pipe(map((res:any)=>{
      // maps JSON response to typescript type
      const account: UserAccount = {
        userId: res.userId,
        username: res.username,
        accountCreationDate: new Date(res.accountCreationDate),
        authorities: res.authorities
      }

      return account;
    }));
  }

  refreshClientProfile(): Observable<ClientInfo> {
    return this.http.get(`${this.SERVICE_URL}/client`)
    .pipe(
      map((res:any)=>{
        let clientProfile: ClientInfo = {
          firstName: res.firstName,
          lastName: res.lastName,
          pronouns: res.pronouns,
          formattedAddress: res.formattedAddress,
          phoneNumber: res.phoneNumber,
          email: res.email,
          contactPreference: res.contactPreference,
          birthday: res.birthday
        }

        return clientProfile;
      }),
      tap((res:ClientInfo)=>this.clientProfile$.next(res))
    );
  }

  getClientProfile(): Observable<ClientInfo> {
    return this.clientProfile$.asObservable()
    .pipe(switchMap((res): Observable<ClientInfo> => {
      if (res) return of(res);
      else return this.refreshClientProfile();
    }));
  }

  updateClientProfile(params: any): Observable<ClientInfo> {
    return this.http.patch(`${this.SERVICE_URL}/client`, params)
      .pipe(switchMap(()=>this.refreshClientProfile()));
  }

  createUserProfile(params: any): Observable<any> {
    return this.http.post(`${this.SERVICE_URL}/r2/profile`, params);
  }

  refreshEmployeesProvidedServices(): Observable<ProvidedService[]> {
    return this.http.get<ProvidedService[]>(`${this.SERVICE_URL}/management/services`)
      .pipe(tap((res:ProvidedService[])=>this.employeeServices$.next(res)));
  }

  getEmployeesProvidedServices(): Observable<ProvidedService[]> {
    return this.employeeServices$.asObservable()
    .pipe(switchMap((res): Observable<ProvidedService[]> => {
      if (res) return of(res);
      else return this.refreshEmployeesProvidedServices();
    }));
  }

  createProvidedService(request: ProvidedService) {
    return this.http.post(`${this.SERVICE_URL}/management/service`, request)
      .pipe(switchMap(()=>this.refreshEmployeesProvidedServices()));
  }

  searchAvailableServices(searchText: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.SERVICE_URL}/services?searchText=${searchText}`);
  }

  getProvidedServiceDetailsForClient(serviceId: number) {
    return this.http.get<any>(`${this.SERVICE_URL}/service/${serviceId}`);
  }

  getAvailableAppointmentTimes(request: { searchDate: string; employeeId: number; serviceId: number }): Observable<any[]> {
    return this.http.post<any[]>(`${this.SERVICE_URL}/schedule`, request);
  }

  bookAppointment(request: { serviceId: number; employeeId: number; time: string; }) {
    return this.http.post(`${this.SERVICE_URL}/schedule/confirm`, request)
      .pipe(switchMap(()=>this.refreshClientSchedule()));
  }

  getClientSchedule(): Observable<any[]> {
    return this.clientAppointments$.asObservable()
    .pipe(switchMap((res): Observable<any[]> => {
      if (res) return of(res);
      else return this.refreshClientSchedule();
    }));
  }

  getEmployeeSchedule(): Observable<Appointment[]> {
    return this.employeeAppointments$.asObservable()
    .pipe(switchMap((res): Observable<Appointment[]> => {
      if (res) return of(res);
      else return this.refreshEmployeeSchedule();
    }));
  }

  getAppointmentDetailsForClient(appointmentId: number): Observable<Appointment> {
    return this.clientAppointments$.asObservable()
    .pipe(
      switchMap((res:Appointment[]|undefined): Observable<Appointment[]> => {
        if (!res) return this.refreshClientSchedule();
        else return of (res);
      }),
      map((res:Appointment[]): Appointment => {
        for (const apt of res) {
          if (Number(apt.appointmentId) === Number(appointmentId)) return apt;
        }
        throw new Error("Could not find cached client-formatted appointment...")
      }));
  }

  getAppointmentDetailsForEmployee(appointmentId: number): Observable<Appointment> {
    return this.employeeAppointments$.asObservable()
    .pipe(
      switchMap((res:Appointment[]|undefined): Observable<Appointment[]> => {
        if (!res) return this.refreshEmployeeSchedule();
        else return of (res);
      }),
      map((res:Appointment[]): Appointment => {
        for (const apt of res) {
          if (Number(apt.appointmentId) === Number(appointmentId)) return apt;
        }
        throw new Error("Could not find cached employee-formatted appointment...")
      }));
  }

  refreshClientSchedule() {
    return this.http.get<any[]>(`${this.SERVICE_URL}/schedule`)
      .pipe(tap((res:any[])=>this.clientAppointments$.next(res)));
  }

  refreshEmployeeSchedule() {
    return this.http.get<any[]>(`${this.SERVICE_URL}/management/schedule`)
      .pipe(tap((res:any[])=>this.employeeAppointments$.next(res)));
  }

  unlockEmployeePermissions(enteredCode: string) {
    return this.http.patch(`${this.SERVICE_URL}/r2/access/employee?accessCode=${enteredCode}`, {})
  }

  unlockClientPermissions() {
    return this.http.patch(`${this.SERVICE_URL}/r2/access/client`, {})
  }

  getEmployeeProfile(): Observable<EmployeeProfile> {
    return this.employeeProfile$.asObservable()
      .pipe(switchMap((res: EmployeeProfile|undefined)=> {
        if (res) return of(res);
        else return this.refreshEmployeeProfile();
      }));
  }

  refreshEmployeeProfile(): Observable<EmployeeProfile> {
    return this.http.get<EmployeeProfile>(`${this.SERVICE_URL}/management/employee`)
      .pipe(tap((res: EmployeeProfile)=>this.employeeProfile$.next(res)));
  }

  getPublicEmployeeProfile(employeeId: number): Observable<EmployeeProfile> {
    return this.http.get<EmployeeProfile>(`${this.SERVICE_URL}/employee/${employeeId}`);
  }

  updateEmployeeProfile(params: any) {
    return this.http.patch(`${this.SERVICE_URL}/management/employee`, params)
      .pipe(switchMap(()=>this.refreshEmployeeProfile()))
  }
}
