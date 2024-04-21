import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {UserAccount} from "../interface/user-account.interface";
import {ProvidedService, ProvidedServiceDetails, ProvidedServiceProfile} from "../interface/provided-service.interface";
import {Appointment, AppointmentOpening} from "../interface/appointment.interface";
import {ClientInfo, EmployeeProfile} from "../interface/profile.interface";


/**
 * An HTTP Client responsible for consuming the REST API provided by our Salon Web Service
 *
 * @author William A. Morris
 * @since 2024-02-06
 */
@Injectable()
export class SalonClient {

  private SERVICE_URL = environment.webService.path;

  constructor(private http: HttpClient) { }

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
    return this.http.post(`${this.SERVICE_URL}/login`, {})
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

  createUserProfile(params: any): Observable<void> {
    return this.http.post<void>(`${this.SERVICE_URL}/newUser/profile`, params);
  }

  getProvidedServiceProfile(serviceId: number): Observable<ProvidedServiceProfile> {
    return this.http.get<ProvidedServiceProfile>(`${this.SERVICE_URL}/shared/service/${serviceId}`);
  }

  getAvailableAppointmentTimes(request: { searchDate: string; employeeId: number; serviceId: number }): Observable<AppointmentOpening[]> {
    return this.http.post<AppointmentOpening[]>(`${this.SERVICE_URL}/client/schedule`, request);
  }
  unlockEmployeePermissions(enteredCode: string): Observable<void> {
    return this.http.patch<void>(`${this.SERVICE_URL}/newUser/access/employee?accessCode=${enteredCode}`, {})
  }

  unlockClientPermissions(): Observable<void> {
    return this.http.patch<void>(`${this.SERVICE_URL}/newUser/access/client`, {})
  }

  getPublicEmployeeProfile(employeeId: number): Observable<EmployeeProfile> {
    return this.http.get<EmployeeProfile>(`${this.SERVICE_URL}/public/profile/${employeeId}`);
  }

  getProvidedServiceImages(serviceId:number): Observable<Map<String, String>>  {
    return this.http.get<Map<String, String>>(`${this.SERVICE_URL}/employee/service/${serviceId}/images`);
  }

  getClientInfo(): Observable<ClientInfo> {
    return this.http.get<ClientInfo>(`${this.SERVICE_URL}/client/profile`)
  }

  updateClientProfile(params: any): Observable<void> {
    return this.http.patch<void>(`${this.SERVICE_URL}/client/profile`, params)
  }

  getCurrentEmployeeServices(): Observable<ProvidedService[]> {
    return this.http.get<ProvidedService[]>(`${this.SERVICE_URL}/employee/services`)
  }

  createProvidedService(request: ProvidedService): Observable<void> {
    return this.http.post<void>(`${this.SERVICE_URL}/employee/service`, request)
  }

  searchAvailableServices(searchText: string): Observable<ProvidedServiceDetails[]> {
    return this.http.get<ProvidedServiceDetails[]>(`${this.SERVICE_URL}/shared/services?searchText=${searchText}`)
  }

  bookAppointment(request: { serviceId: number; employeeId: number; time: string }): Observable<void> {
    return this.http.post<void>(`${this.SERVICE_URL}/client/schedule/confirm`, request);
  }

  getSchedule(type: "client" | "employee") {
    return this.http.get<Appointment[]>(`${this.SERVICE_URL}/${type}/schedule`);
  }

  getCurrentEmployeeProfile() {
    return this.http.get<EmployeeProfile>(`${this.SERVICE_URL}/employee/profile`);
  }

  updateEmployeeProfile(params: EmployeeProfile): Observable<void> {
    return this.http.patch<void>(`${this.SERVICE_URL}/employee/profile`, params);
  }

  updateEmployeeProfileImage(image: File): Observable<void> {
    let postBody = new FormData();
    postBody.append("image",image);

    return this.http.post<void>(`${this.SERVICE_URL}/employee/profile/image`, postBody)
  }

  getFeaturedEmployees(): Observable<EmployeeProfile[]> {
    return this.http.get<EmployeeProfile[]>(`${this.SERVICE_URL}/public/featuredEmployees`)
  }

  uploadProvidedServiceImage(serviceId: number, image: File): Observable<void> {
    let postBody = new FormData();
    postBody.append("image",image);

    return this.http.post<void>(`${this.SERVICE_URL}/employee/service/${serviceId}`, postBody)
  }

  deleteProvidedServiceImage(serviceId: number, contentId: string): Observable<void> {
    return this.http.delete<void>(`${this.SERVICE_URL}/employee/service/${serviceId}/image/${contentId}`);
  }

  updateProvidedServiceProfile(serviceId: number, params: any): Observable<void> {
    return this.http.patch<void>(`${this.SERVICE_URL}/employee/service/${serviceId}`, params);
  }

  deleteProvidedService(serviceId: number): Observable<void> {
    return this.http.delete<void>(`${this.SERVICE_URL}/employee/service/${serviceId}`);
  }
}
