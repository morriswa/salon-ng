
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

  isPublicRequest(url:string): boolean {
    let publicRequest = false;

    for (const requestMatcher of environment.webService.publicUrls)
      publicRequest = publicRequest || (url === `${environment.webService.path}${requestMatcher}`);

    return publicRequest;
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (req.url.startsWith(environment.webService.path)&&!this.isPublicRequest(req.url)) {

      const authReq = req.clone({
        headers: req.headers.set('Authorization', this.credentials.token)
      });

      return next.handle(authReq);
    } else return next.handle(req);
  }
}
