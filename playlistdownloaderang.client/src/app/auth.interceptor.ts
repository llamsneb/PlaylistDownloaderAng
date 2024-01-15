import { HttpInterceptorFn, HttpErrorResponse, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';

import { catchError, map, tap } from 'rxjs/operators';

import { AuthorizationService } from './authorization.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authorizationService = inject(AuthorizationService);  

  //if (authorizationService.isLoggedIn.value) {
  let modifiedReq: HttpRequest<any>;
  if (req.url == authorizationService.authorizationEndpoint || req.url == authorizationService.tokenEndpoint) {
    modifiedReq = req.clone({
      headers: req.headers.set('Content-Type', 'application/x-www-form-urlencoded')
    });      
  }
  else {
    modifiedReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ` + authorizationService.currentToken.access_token),
    });
  }
  return next(modifiedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status == 401) {
        return authorizationService.autoRefreshToken(modifiedReq, next).pipe(
          tap(() =>
            authorizationService.isLoggedIn.next(!!authorizationService.currentToken.access_token)
          )
        );
      }
      else {
        return throwError(() => error);
      }
    })
  );
  //}
  //else {    
  //  return next(req);
  //}
};
