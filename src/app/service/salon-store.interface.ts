import {Observable} from 'rxjs';
import {UserAccount} from "../interface/user-account.interface";
import {ClientInfo, EmployeeProfile} from "../interface/profile.interface";
import {ProvidedService, ProvidedServiceDetails, ProvidedServiceProfile} from "../interface/provided-service.interface";
import {Appointment, AppointmentOpening} from "../interface/appointment.interface";


/**
 * A datastore responsible for providing async data to the application
 *
 * @author William A. Morris
 * @since 2024-02-06
 */
export interface SalonStoreInterface {

  // UTIL
  resetCache(): void;


  // ACCOUNT
  registerUser(username: string, password: string): Observable<void>;

  login(): Observable<UserAccount>;

  createUserProfile(params: any): Observable<void>;


  // CLIENT
  refreshAndRetrieveClientProfile(): Observable<ClientInfo>;

  getCurrentClientProfile(): Observable<ClientInfo>;

  updateCurrentClientProfile(params: ClientInfo): Observable<ClientInfo>;

  getAvailableAppointmentTimes(
    request: { searchDate: string; employeeId: number; serviceId: number }
  ): Observable<AppointmentOpening[]>;

  bookAppointment(request: { serviceId: number; employeeId: number; time: string; }): Observable<Appointment[]>;


  // EMPLOYEE

    // PROFILE
    getCurrentEmployeeProfile(): Observable<EmployeeProfile>;

    refreshAndRetrieveEmployeeProfile(): Observable<EmployeeProfile>;

    updateEmployeeProfile(params: EmployeeProfile): Observable<EmployeeProfile>;

    updateEmployeeProfileImage(image: File): Observable<EmployeeProfile>;

    // SERVICES
    getCurrentEmployeesServices(): Observable<ProvidedService[]>;

    refreshAndRetrieveCurrentEmployeesServices(): Observable<ProvidedService[]>;

    createProvidedService(request: ProvidedService): Observable<ProvidedService[]>;

    updateProvidedServiceAndGetProfile(serviceId: number, params: any): Observable<ProvidedServiceProfile>;

    deleteProvidedService(serviceId: number): Observable<ProvidedService[]>;

      // IMAGES
      uploadProvidedServiceImage(serviceId: number, image: File): Observable<Map<String, String>>;

      getProvidedServiceImages(serviceId:number): Observable<Map<String, String>>;

      deleteProvidedServiceImage(serviceId: number, contentId: string): Observable<Map<String, String>>;


  // SHARED
  searchAvailableServices(searchText: string): Observable<ProvidedServiceDetails[]>;

  getProvidedServiceProfile(serviceId: number): Observable<ProvidedServiceProfile>;

  getSchedule(type: 'client'|'employee'): Observable<Appointment[]>;

  getAppointmentDetails(appointmentId: number, type: 'client'|'employee'): Observable<Appointment>;

  refreshAndRetrieveSchedule(type: 'client'|'employee'): Observable<Appointment[]>;

  getPublicEmployeeProfile(employeeId: number): Observable<EmployeeProfile>;

  getFeaturedEmployees(): Observable<EmployeeProfile[]>;
}
