import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Eecs447ClientService {


  SERVICE_URL = 'http://127.0.0.1:8080'

  constructor(private http: HttpClient, private auth: AuthenticationService) { }

  healthCheck() {
    return this.http.get(`${this.SERVICE_URL}/health`).pipe(
      map(res=>{
        console.log(res);
        return res
      }));
  }

  getUserProfile() {
    return this.http.get(`${this.SERVICE_URL}/user`).pipe(
      map((res:any)=>{
        console.log(res.message);
        return res.payload
      }));
  }
}
