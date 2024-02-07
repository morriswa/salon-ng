import {HttpClient, HttpEvent, HttpResponse} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable, map, tap} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SalonClient {


  public static SERVICE_URL = '//127.0.0.1:8080';
  private SERVICE_URL = SalonClient.SERVICE_URL;

  constructor(private http: HttpClient) { }

  healthCheck() {
    return this.http.get(`${this.SERVICE_URL}/health`);
  }

  login() {
    return this.http.get(`${this.SERVICE_URL}/login`);
  }

  getUserProfile() {
    return this.http.get(`${this.SERVICE_URL}/user`).pipe(
      map((res:any)=>{
        console.log(res.message);
        return res.payload
      }));
  }

  employeeLogin() {
    return this.http.get(`${this.SERVICE_URL}/employee/login`);
  }
}
