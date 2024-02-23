import {HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {map, Observable} from 'rxjs';
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

  getUserProfile(): Observable<UserProfile> {
    return this.http.get(`${this.SERVICE_URL}/user`).pipe(map((res:any)=>{
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
    }));
  }

  updateUserProfile(params: any) {
    return this.http.patch(`${this.SERVICE_URL}/user`, params);
  }

  createUserProfile(params: any) {
    return this.http.post(`${this.SERVICE_URL}/user`, params);
  }

  getProvidedServices(): Observable<any[]> {
    return this.http.get<any[]>(`${this.SERVICE_URL}/employee/service`)
  }

  createProvidedService(request: { defaultCost: string; defaultLength: number; name: string }) {
    return this.http.post(`${this.SERVICE_URL}/employee/service`, request);
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
    return this.http.post(`${this.SERVICE_URL}/client/book`, request);
  }

  getClientSchedule(): Observable<any[]> {
    return this.http.get<any[]>(`${this.SERVICE_URL}/client/booked`);
  }
}
