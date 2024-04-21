import {inject} from '@angular/core';
import {HttpInterceptorFn} from '@angular/common/http';
import { CredentialService } from './service/credential.service';
import {environment} from "../environments/environment";

/**
 * determines whether a request needs credentials to be sent
 * @param url of the request to send
 */
export const is_public_req = (url:string): boolean  => {
  let publicRequest = false;
  for (const requestMatcher of environment.webService.publicUrls) {
    const testPath = `${environment.webService.path}${requestMatcher}`
    publicRequest =
      publicRequest
      || (url===testPath)
      || (
        url.startsWith(testPath.substring(0, testPath.lastIndexOf('/')))
        &&
        testPath.endsWith('**')
      );
  }

  return publicRequest;
}

/**
 * adds a token to a private endpoint request
 *
 * @param req of the current http request
 * @param next the modified request to send
 */
export const add_token_interceptor: HttpInterceptorFn = (req, next) => {
  const creds = inject(CredentialService);

  if (req.url.startsWith(environment.webService.path) && !is_public_req(req.url)) {

    const authReq = req.clone({
      headers: req.headers.set('Authorization', creds.token),
      withCredentials: true
    });

    return next(authReq);
  } else return next(req);
}
