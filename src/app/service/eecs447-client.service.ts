import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class Eecs447ClientService {

  SERVICE_URL = 'http://127.0.0.1:8080'

  constructor(private http: HttpClient, private auth: AuthenticationService) { }

  healthCheck() {
    return this.http.get(`${this.SERVICE_URL}/health`).pipe(res=>{
      console.log(res);
      return res
    })
  }
}
