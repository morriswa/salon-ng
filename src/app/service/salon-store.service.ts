import { Injectable } from '@angular/core';
import {map, Observable, of, switchMap, tap} from 'rxjs';
import {UserAccount} from "../interface/user-account.interface";
import {ClientInfo, EmployeeProfile} from "../interface/profile.interface";
import {ProvidedService, ProvidedServiceDetails, ProvidedServiceProfile} from "../interface/provided-service.interface";
import {Appointment, AppointmentOpening} from "../interface/appointment.interface";
import CachedResult from "./cached-result";
import {SalonStoreInterface} from "./salon-store.interface";
import {SalonClient} from "./salon-client.service";


/**
 * An HTTP Client responsible for consuming the REST API provided by our Salon Web Service
 *
 * @author William A. Morris
 * @since 2024-02-06
 */
@Injectable()
export class SalonStore implements SalonStoreInterface {


  // in memory cache
  clientProfile$!: CachedResult<ClientInfo>;
  employeeProfile$!: CachedResult<EmployeeProfile>
  featuredEmployeeProfiles$!: CachedResult<EmployeeProfile[]>;
  schedule$!: CachedResult<Appointment[]>;
  employeeServices$!: CachedResult<ProvidedService[]>;
  clientViewedServices!: Map<number, ProvidedServiceProfile>;
  publicProfiles!: Map<number, EmployeeProfile>;
  searchResults!: Map<string, ProvidedServiceDetails[]>;

  constructor(private salonClient: SalonClient) {
    this.resetCache();
  }

  resetCache() {

    this.clientProfile$ = new CachedResult<ClientInfo>();

    this.employeeProfile$ = new CachedResult<EmployeeProfile>();

    this.featuredEmployeeProfiles$ = new CachedResult<EmployeeProfile[]>();

    this.employeeServices$ = new CachedResult<ProvidedService[]>();

    this.schedule$ = new CachedResult<Appointment[]>();

    this.clientViewedServices = new Map<number, ProvidedServiceProfile>();

    this.publicProfiles = new Map<number, EmployeeProfile>();

    this.searchResults = new Map<string, ProvidedServiceDetails[]>();
  }

  registerUser(username: string, password: string): Observable<void> {
    return this.salonClient.registerUser(username, password);
  }

  login(): Observable<UserAccount> {
    return this.salonClient.login();
  }

  createUserProfile(params: any): Observable<void> {
    return this.salonClient.createUserProfile(params);
  }

  getAvailableAppointmentTimes(request: { searchDate: string; employeeId: number; serviceId: number; }): Observable<AppointmentOpening[]> {
    return this.salonClient.getAvailableAppointmentTimes(request);
  }

  getProvidedServiceImages(serviceId: number): Observable<Map<String, String>> {
    return this.salonClient.getProvidedServiceImages(serviceId);
  }

  getProvidedServiceProfile(serviceId: number): Observable<ProvidedServiceProfile> {
    let profile = this.clientViewedServices.get(serviceId);
    if (profile) return of(profile);
    else return this.salonClient.getProvidedServiceProfile(serviceId)
      .pipe(tap((res)=>{
        this.clientViewedServices.set(serviceId, res);
      }));
  }

  getPublicEmployeeProfile(employeeId: number): Observable<EmployeeProfile> {
    let profile = this.publicProfiles.get(employeeId);
    if (profile) return of(profile);
    else return this.salonClient.getPublicEmployeeProfile(employeeId)
      .pipe(tap((res)=>{
        this.publicProfiles.set(employeeId, res);
      }));
  }

  refreshAndRetrieveClientProfile(): Observable<ClientInfo> {
    return this.clientProfile$.updateCacheWithAndRetrieveValueOf(
      this.salonClient.getClientInfo()
    );
  }

  getCurrentClientProfile(): Observable<ClientInfo> {
    return this.clientProfile$.retrieveCacheOrUpdateWith(this.refreshAndRetrieveClientProfile());
  }

  updateCurrentClientProfile(params: ClientInfo): Observable<ClientInfo> {
    return this.salonClient.updateClientProfile(params)
      .pipe(switchMap(()=>this.refreshAndRetrieveClientProfile()));
  }

  refreshAndRetrieveCurrentEmployeesServices(): Observable<ProvidedService[]> {
    return this.employeeServices$.updateCacheWithAndRetrieveValueOf(
      this.salonClient.getCurrentEmployeeServices()
    );
  }

  getCurrentEmployeesServices(): Observable<ProvidedService[]> {
    return this.employeeServices$.retrieveCacheOrUpdateWith(this.refreshAndRetrieveCurrentEmployeesServices());
  }

  createProvidedService(request: ProvidedService): Observable<ProvidedService[]> {
    return this.salonClient.createProvidedService(request)
      .pipe(switchMap(()=>this.refreshAndRetrieveCurrentEmployeesServices()));
  }

  searchAvailableServices(searchText: string): Observable<ProvidedServiceDetails[]> {
    const result = this.searchResults.get(searchText);
    if (result) return of(result)
    else return this.salonClient.searchAvailableServices(searchText)
      .pipe(tap((res)=>{
        this.searchResults.set(searchText, res);
      }));
  }

  bookAppointment(request: { serviceId: number; employeeId: number; time: string; }): Observable<Appointment[]> {
    return this.salonClient.bookAppointment(request)
      .pipe(switchMap(()=>this.refreshAndRetrieveSchedule('client')));
  }

  getSchedule(type: 'client'|'employee'): Observable<Appointment[]> {
    return this.schedule$.retrieveCacheOrUpdateWith(this.refreshAndRetrieveSchedule(type));
  }

  getAppointmentDetails(appointmentId: number, type: 'client'|'employee'): Observable<Appointment> {
    return of('get appointment details')
    .pipe(
      map(()=>this.schedule$),
      switchMap((res:CachedResult<any>)=>res.retrieveCacheOrUpdateWith(this.refreshAndRetrieveSchedule(type))),
      map((res:Appointment[]): Appointment => {
        for (const apt of res) {
          if (Number(apt.appointmentId) === Number(appointmentId)) return apt;
        }
        throw new Error("Could not find cached appointment...")
      })
    );
  }

  refreshAndRetrieveSchedule(type: 'client'|'employee'): Observable<Appointment[]> {
    return this.schedule$.updateCacheWithAndRetrieveValueOf(
      this.salonClient.getSchedule(type)
    );
  }


  getCurrentEmployeeProfile(): Observable<EmployeeProfile> {
    return this.employeeProfile$.retrieveCacheOrUpdateWith(this.refreshAndRetrieveEmployeeProfile());
  }

  refreshAndRetrieveEmployeeProfile(): Observable<EmployeeProfile> {
    return this.employeeProfile$.updateCacheWithAndRetrieveValueOf(
      this.salonClient.getCurrentEmployeeProfile()
    );
  }

  updateEmployeeProfile(params: EmployeeProfile): Observable<EmployeeProfile> {
    return this.salonClient.updateEmployeeProfile(params)
      .pipe(switchMap(()=>this.refreshAndRetrieveEmployeeProfile()))
  }

  updateEmployeeProfileImage(image: File): Observable<EmployeeProfile> {
    return this.salonClient.updateEmployeeProfileImage(image)
      .pipe(switchMap(()=>this.refreshAndRetrieveEmployeeProfile()))
  }

  getFeaturedEmployees(): Observable<EmployeeProfile[]> {
    return this.featuredEmployeeProfiles$.retrieveCacheOrUpdateWith(
      this.salonClient.getFeaturedEmployees()
    );
  }

  uploadProvidedServiceImage(serviceId: number, image: File): Observable<Map<String, String>> {
    return this.salonClient.uploadProvidedServiceImage(serviceId, image)
      .pipe(switchMap(()=>this.getProvidedServiceImages(serviceId)));
  }


  deleteProvidedServiceImage(serviceId: number, contentId: string): Observable<Map<String, String>> {
    return this.salonClient.deleteProvidedServiceImage(serviceId, contentId)
      .pipe(switchMap(()=>this.getProvidedServiceImages(serviceId)));
  }

  updateProvidedServiceAndGetProfile(serviceId: number, params: any): Observable<ProvidedServiceProfile> {
    return this.salonClient.updateProvidedServiceProfile(serviceId, params)
      .pipe(switchMap(()=>this.getProvidedServiceProfile(serviceId)));
  }

  deleteProvidedService(serviceId: number): Observable<ProvidedService[]> {
    return this.salonClient.deleteProvidedService(serviceId)
      .pipe(switchMap(()=>this.refreshAndRetrieveCurrentEmployeesServices()));
  }
}
