import {HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {BehaviorSubject, map, Observable, of, switchMap, tap} from 'rxjs';
import {environment} from "../../environments/environment";
import {UserAccount} from "../interface/user-account.interface";
import {UserProfile} from "../interface/user-profile.interface";


/**
 * An HTTP Client responsible for consuming the REST API provided by our Salon Web Service
 */
@Injectable({
  providedIn: 'root'
})
export class SalonClient {

  private SERVICE_URL = environment.webService.path;

  userProfile$: BehaviorSubject<UserProfile|undefined> = new BehaviorSubject<UserProfile | undefined>(undefined);
  employeeServices$: BehaviorSubject<any[]|undefined> = new BehaviorSubject<any[]|undefined>(undefined);
  clientAppointments$: BehaviorSubject<any[]|undefined> = new BehaviorSubject<any[]|undefined>(undefined);
  employeeAppointments$: BehaviorSubject<any[]|undefined> = new BehaviorSubject<any[]|undefined>(undefined);

  constructor(private http: HttpClient) { }


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

  refreshUserProfile(): Observable<UserProfile> {
    return this.http.get(`${this.SERVICE_URL}/user`)
    .pipe(
      map((res:any)=>{
        const userProfile: UserProfile = {
          userId: res.userId,
          username: res.username,
          accountCreationDate: new Date(res.accountCreationDate),
          firstName: res.firstName,
          lastName: res.lastName,
          address: res.address,
          phoneNumber: res.phoneNumber,
          email: res.email,
          contactPreference: res.contactPreference
        }

        return userProfile;
      }),
      tap((res:UserProfile)=>this.userProfile$.next(res))
    );
  }

  getUserProfile(): Observable<UserProfile> {
    return this.userProfile$.asObservable()
    .pipe(switchMap((res): Observable<UserProfile> => {
      if (res) return of(res);
      else return this.refreshUserProfile();
    }));
  }

  updateUserProfile(params: any): Observable<UserProfile> {
    return this.http.patch(`${this.SERVICE_URL}/user`, params)
      .pipe(switchMap(()=>this.refreshUserProfile()));
  }

  createUserProfile(params: any): Observable<UserProfile> {
    return this.http.post(`${this.SERVICE_URL}/user`, params)
      .pipe(switchMap(()=>this.refreshUserProfile()));
  }

  refreshEmployeesProvidedServices(): Observable<any[]> {
    return this.http.get<any[]>(`${this.SERVICE_URL}/employee/service`)
      .pipe(tap((res:any[])=>this.employeeServices$.next(res)));
  }

  getEmployeesProvidedServices(): Observable<any[]> {
    return this.employeeServices$.asObservable()
    .pipe(switchMap((res): Observable<any[]> => {
      if (res) return of(res);
      else return this.refreshEmployeesProvidedServices();
    }));
  }

  createProvidedService(request: { defaultCost: string; defaultLength: number; name: string }) {
    return this.http.post(`${this.SERVICE_URL}/employee/service`, request)
      .pipe(switchMap(()=>this.refreshEmployeesProvidedServices()));
  }

  searchAvailableServices(searchText: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.SERVICE_URL}/client/services?searchText=${searchText}`);
  }

  getProvidedServiceDetailsForClient(serviceId: number) {
    return this.http.get<any>(`${this.SERVICE_URL}/client/service/${serviceId}`);
  }

  getAvailableAppointmentTimes(request: { searchDate: string; employeeId: number; serviceId: number }): Observable<any[]> {
    return this.http.post<any[]>(`${this.SERVICE_URL}/client/booking`, request);
  }

  bookAppointment(request: { serviceId: number; employeeId: number; time: string; }) {
    return this.http.post(`${this.SERVICE_URL}/client/book`, request)
      .pipe(switchMap(()=>this.refreshClientSchedule()));
  }

  getClientSchedule(): Observable<any[]> {
    return this.clientAppointments$.asObservable()
    .pipe(switchMap((res): Observable<any[]> => {
      if (res) return of(res);
      else return this.refreshClientSchedule();
    }));
  }

  getEmployeeSchedule(): Observable<any[]> {
    return this.employeeAppointments$.asObservable()
    .pipe(switchMap((res): Observable<any[]> => {
      if (res) return of(res);
      else return this.refreshEmployeeSchedule();
    }));
  }

  getAppointmentDetailsForClient(appointmentId: number): Observable<any> {
    return this.clientAppointments$.asObservable()
    .pipe(
      switchMap((res:any[]|undefined): Observable<any[]> => {
        if (!res) return this.refreshClientSchedule();
        else return of (res);
      }),
      map((res:any[]): Observable<any> => {
        for (const apt of res) {
          if (Number(apt.appointmentId) === Number(appointmentId)) return apt;
        }
        throw new Error("Could not find cached client-formatted appointment...")
      }));
  }

  getAppointmentDetailsForEmployee(appointmentId: number): Observable<any> {
    return this.employeeAppointments$.asObservable()
    .pipe(
      switchMap((res:any[]|undefined): Observable<any[]> => {
        if (!res) return this.refreshEmployeeSchedule();
        else return of (res);
      }),
      map((res:any[]): Observable<any> => {
        for (const apt of res) {
          if (Number(apt.appointmentId) === Number(appointmentId)) return apt;
        }
        throw new Error("Could not find cached employee-formatted appointment...")
      }));
  }

  refreshClientSchedule() {
    return this.http.get<any[]>(`${this.SERVICE_URL}/client/booked`)
      .pipe(tap((res:any[])=>this.clientAppointments$.next(res)));
  }

  refreshEmployeeSchedule() {
    return this.http.get<any[]>(`${this.SERVICE_URL}/employee/schedule`)
      .pipe(tap((res:any[])=>this.employeeAppointments$.next(res)));
  }

  unlockEmployeePermissions(enteredCode: string) {
    return this.http.patch(`${this.SERVICE_URL}/user/access/employee?accessCode=${enteredCode}`, {})
  }

  unlockClientPermissions() {
    return this.http.patch(`${this.SERVICE_URL}/user/access/client`, {})
  }

  resetCache() {
    this.userProfile$ = new BehaviorSubject<UserProfile | undefined>(undefined);
    this.employeeServices$ = new BehaviorSubject<any[]|undefined>(undefined);
    this.clientAppointments$ = new BehaviorSubject<any[]|undefined>(undefined);
    this.employeeAppointments$ = new BehaviorSubject<any[]|undefined>(undefined);
  }
}
