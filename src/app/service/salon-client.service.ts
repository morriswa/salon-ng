import {HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {map} from 'rxjs';
import {environment} from "../../environments/environment";


/**
 * An HTTP Client responsible for consuming the REST API provided by our Salon Web Service
 */
@Injectable({
  providedIn: 'root'
})
export class SalonClient {

  private SERVICE_URL = environment.webService.url;

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

  login() {
    return this.http.get(`${this.SERVICE_URL}/login`);
  }

  getUserProfile() {
    return this.http.get(`${this.SERVICE_URL}/user`);
  }

  updateUserProfile(params: any) {
    return this.http.patch(`${this.SERVICE_URL}/user`, params);
  }

  createUserProfile(params: any) {
    return this.http.post(`${this.SERVICE_URL}/user`, params);
  }
}
