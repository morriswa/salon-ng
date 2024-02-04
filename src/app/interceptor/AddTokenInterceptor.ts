
import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest
} from '@angular/common/http';

import { Observable } from 'rxjs';
import { AuthenticationService } from '../service/authentication.service';

@Injectable()
export class AddTokenInterceptor implements HttpInterceptor {

  constructor(private auth: AuthenticationService) {

  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
            
      const authReq = req.clone({
        headers: req.headers.set('Authorization', this.auth.token)
      });

      return next.handle(authReq);
    }
}