import {HttpInterceptorFn} from '@angular/common/http';


/**
 * adds a token to a private endpoint request
 *
 * @param req of the current http request
 * @param next the modified request to send
 */
export const xhr_interceptor: HttpInterceptorFn = (req, next) => {
  const xhr = req.clone({
    headers: req.headers.set('X-Requested-With', 'XMLHttpRequest')
  });
  return next(xhr);
}
