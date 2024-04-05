import {HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {map, Observable, of, switchMap, tap} from 'rxjs';
import {environment} from "../../environments/environment";
import {UserAccount} from "../interface/user-account.interface";
import {ClientInfo, EmployeeProfile} from "../interface/profile.interface";
import {ProvidedService, ProvidedServiceDetails, ProvidedServiceProfile} from "../interface/provided-service.interface";
import {Appointment, AppointmentOpening} from "../interface/appointment.interface";
import CachedResult from "./cached-result";


/**
 * An HTTP Client responsible for consuming the REST API provided by our Salon Web Service
 *
 * @author William A. Morris
 * @since 2024-02-06
 */
@Injectable()
export class SalonClient {

  private SERVICE_URL = environment.webService.path;

  // cache
  clientProfile$!: CachedResult<ClientInfo>;
  employeeProfile$!: CachedResult<EmployeeProfile>
  featuredEmployeeProfiles$!: CachedResult<EmployeeProfile[]>;

  clientAppointments$!: CachedResult<Appointment[]>;
  employeeAppointments$!: CachedResult<Appointment[]>;

  employeeServices$!: CachedResult<ProvidedService[]>;

  searchResults$!: Map<string, ProvidedServiceDetails[]>

  constructor(private http: HttpClient) {
    this.resetCache();
  }

  resetCache() {

    this.clientProfile$ = new CachedResult<ClientInfo>();

    this.employeeProfile$ = new CachedResult<EmployeeProfile>();

    this.featuredEmployeeProfiles$ = new CachedResult<EmployeeProfile[]>();

    this.employeeServices$ = new CachedResult<ProvidedService[]>();

    this.clientAppointments$ = new CachedResult<Appointment[]>();

    this.employeeAppointments$ = new CachedResult<Appointment[]>();

    this.searchResults$ = new Map<string, ProvidedServiceDetails[]>();
  }

  healthCheck(): Observable<string> {
    return this.http.get(`${this.SERVICE_URL}/health`)
    .pipe(map((res:any)=>res.message));
  }

  registerUser(username: string, password: string): Observable<void> {
    return this.http.post<void>(`${this.SERVICE_URL}/register`, {
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
    return this.http.get<ClientInfo>(`${this.SERVICE_URL}/client/profile`)
    .pipe(tap((res:ClientInfo)=>this.clientProfile$.updateCache(res)));
  }

  getClientProfile(): Observable<ClientInfo> {
    return this.clientProfile$.getOr(this.refreshClientProfile());
  }

  updateClientProfile(params: ClientInfo): Observable<ClientInfo> {
    return this.http.patch(`${this.SERVICE_URL}/client/profile`, params)
      .pipe(switchMap(()=>this.refreshClientProfile()));
  }

  createUserProfile(params: any): Observable<void> {
    return this.http.post<void>(`${this.SERVICE_URL}/newUser/profile`, params);
  }

  refreshEmployeesProvidedServices(): Observable<ProvidedService[]> {
    return this.http.get<ProvidedService[]>(`${this.SERVICE_URL}/employee/services`)
      .pipe(tap((res:ProvidedService[])=>this.employeeServices$.updateCache(res)));
  }

  getEmployeesProvidedServices(): Observable<ProvidedService[]> {
    return this.employeeServices$.getOr(this.refreshEmployeesProvidedServices());
  }

  createProvidedService(request: ProvidedService): Observable<ProvidedService[]> {
    return this.http.post(`${this.SERVICE_URL}/employee/service`, request)
      .pipe(switchMap(()=>this.refreshEmployeesProvidedServices()));
  }

  searchAvailableServices(searchText: string): Observable<ProvidedServiceDetails[]> {
    const result = this.searchResults$.get(searchText);
    if (result) return of(result)
    else return this.http.get<ProvidedServiceDetails[]>(`${this.SERVICE_URL}/shared/services?searchText=${searchText}`)
      .pipe(tap((res)=>{
        this.searchResults$.set(searchText, res);
      }));
  }

  getProvidedServiceDetailsForClient(serviceId: number): Observable<ProvidedServiceProfile> {
    return this.http.get<ProvidedServiceProfile>(`${this.SERVICE_URL}/shared/service/${serviceId}`);
  }

  getAvailableAppointmentTimes(request: { searchDate: string; employeeId: number; serviceId: number }): Observable<AppointmentOpening[]> {
    return this.http.post<AppointmentOpening[]>(`${this.SERVICE_URL}/client/schedule`, request);
  }

  bookAppointment(request: { serviceId: number; employeeId: number; time: string; }): Observable<Appointment[]> {
    return this.http.post<void>(`${this.SERVICE_URL}/client/schedule/confirm`, request)
      .pipe(switchMap(()=>this.refreshClientSchedule()));
  }

  getClientSchedule(): Observable<Appointment[]> {
    return this.clientAppointments$.getOr(this.refreshClientSchedule());
  }

  getEmployeeSchedule(): Observable<Appointment[]> {
    return this.employeeAppointments$.getOr(this.refreshEmployeeSchedule());
  }

  getAppointmentDetailsForClient(appointmentId: number): Observable<Appointment> {
    return this.clientAppointments$.getOr(this.refreshClientSchedule())
    .pipe(
      map((res:Appointment[]): Appointment => {
        for (const apt of res) {
          if (Number(apt.appointmentId) === Number(appointmentId)) return apt;
        }
        throw new Error("Could not find cached client-formatted appointment...")
      }));
  }

  getAppointmentDetailsForEmployee(appointmentId: number): Observable<Appointment> {
    return this.employeeAppointments$.getOr(this.refreshEmployeeSchedule())
    .pipe(
      map((res:Appointment[]): Appointment => {
        for (const apt of res) {
          if (Number(apt.appointmentId) === Number(appointmentId)) return apt;
        }
        throw new Error("Could not find cached employee-formatted appointment...")
      }));
  }

  refreshClientSchedule(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.SERVICE_URL}/client/schedule`)
      .pipe(tap((res:Appointment[])=>this.clientAppointments$.updateCache(res)));
  }

  refreshEmployeeSchedule(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.SERVICE_URL}/employee/schedule`)
      .pipe(tap((res:Appointment[])=>this.employeeAppointments$.updateCache(res)));
  }

  unlockEmployeePermissions(enteredCode: string): Observable<void> {
    return this.http.patch<void>(`${this.SERVICE_URL}/newUser/access/employee?accessCode=${enteredCode}`, {})
  }

  unlockClientPermissions(): Observable<void> {
    return this.http.patch<void>(`${this.SERVICE_URL}/newUser/access/client`, {})
  }

  getEmployeeProfile(): Observable<EmployeeProfile> {
    return this.employeeProfile$.getOr(this.refreshEmployeeProfile());
  }

  refreshEmployeeProfile(): Observable<EmployeeProfile> {
    return this.http.get<EmployeeProfile>(`${this.SERVICE_URL}/employee/profile`)
      .pipe(tap((res: EmployeeProfile)=>this.employeeProfile$.updateCache(res)));
  }

  getPublicEmployeeProfile(employeeId: number): Observable<EmployeeProfile> {
    return this.http.get<EmployeeProfile>(`${this.SERVICE_URL}/public/profile/${employeeId}`);
  }

  updateEmployeeProfile(params: EmployeeProfile): Observable<EmployeeProfile> {
    return this.http.patch(`${this.SERVICE_URL}/employee/profile`, params)
      .pipe(switchMap(()=>this.refreshEmployeeProfile()))
  }

  updateEmployeeProfileImage(image: File): Observable<EmployeeProfile> {
    let postBody = new FormData();
    postBody.append("image",image);

    return this.http.post(`${this.SERVICE_URL}/employee/profile/image`, postBody)
      .pipe(switchMap(()=>this.refreshEmployeeProfile()))
  }

  getFeaturedEmployees(): Observable<EmployeeProfile[]> {
    return this.featuredEmployeeProfiles$.getOr(
      this.http.get<EmployeeProfile[]>(`${this.SERVICE_URL}/public/featuredEmployees`)
    );
  }

  uploadProvidedServiceImage(serviceId: number, image: File): Observable<Map<String, String>> {
    let postBody = new FormData();
    postBody.append("image",image);

    return this.http.post(`${this.SERVICE_URL}/employee/service/${serviceId}`, postBody)
      .pipe(switchMap(()=>this.getProvidedServiceImages(serviceId)));
  }

  getProvidedServiceImages(serviceId:number): Observable<Map<String, String>>  {
    return this.http.get<Map<String, String>>(`${this.SERVICE_URL}/employee/service/${serviceId}/images`);
  }

  deleteProvidedServiceImage(serviceId: number, contentId: string): Observable<Map<String, String>> {
    return this.http.delete(`${this.SERVICE_URL}/employee/service/${serviceId}/image/${contentId}`)
      .pipe(switchMap(()=>this.getProvidedServiceImages(serviceId)));
  }

  updateProvidedService(serviceId: number, params: any) {
    return this.http.patch(`${this.SERVICE_URL}/employee/service/${serviceId}`, params)
      .pipe(switchMap(()=>this.getProvidedServiceDetailsForClient(serviceId)));
  }

  deleteProvidedService(serviceId: number) {
    return this.http.delete(`${this.SERVICE_URL}/employee/service/${serviceId}`)
      .pipe(tap(()=>this.refreshEmployeesProvidedServices()));
  }
}
