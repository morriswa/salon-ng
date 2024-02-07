import {HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {map, OperatorFunction} from 'rxjs';
import {environment} from "../../environments/environment";


/**
 * when passed into an RXJS pipe, this operator maps the full JSON response to the payload
 * this logs the service message to the console as well
 */
const extractPayload: OperatorFunction<any, any> = map((res:any):any => {
  console.log(res.message);
  return res.payload;
});


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
    .pipe(map((res:any)=>{
      console.log(res.message);
      return res.message;
    }));
  }

  login() {
    return this.http.get(`${this.SERVICE_URL}/login`).pipe(extractPayload);
  }

  getUserProfile() {
    return this.http.get(`${this.SERVICE_URL}/user`).pipe(extractPayload);
  }

}
