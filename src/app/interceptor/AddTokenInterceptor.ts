
import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { CredentialService } from '../service/credential.service';
import {environment} from "../../environments/environment";

@Injectable()
export class AddTokenInterceptor implements HttpInterceptor {

  constructor(private credentials: CredentialService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.startsWith(environment.webService.url)
        &&!(req.url.endsWith("register")||req.url.endsWith('health'))) {

      const authReq = req.clone({
        headers: req.headers.set('Authorization', this.credentials.token)
      });

      return next.handle(authReq);
    } else return next.handle(req);
  }
}
