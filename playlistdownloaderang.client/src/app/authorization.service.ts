import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../environments/environment';
import { AuthToken } from './models/auth-token.model';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {
  clientId: string = '22371a408fff416ead0fdfe8019d0a1a'; // your clientId

  authorizationEndpoint: string = "https://accounts.spotify.com/authorize";
  tokenEndpoint: string = "https://accounts.spotify.com/api/token";
  scope: string = 'user-read-private user-read-email user-top-read';



  // Data structure that manages the current active token, caching it in localStorage
  currentToken = {
    get access_token() { return localStorage.getItem('access_token') },
    get refresh_token() { return localStorage.getItem('refresh_token') },
    get expires_in() { return localStorage.getItem('expires_in') },
    get expires() { return localStorage.getItem('expires') },

    save: function (response: any) {
      const { access_token, refresh_token, expires_in } = response;
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);
      localStorage.setItem('expires_in', expires_in);

      const now = new Date();
      const expiry = new Date(now.getTime() + (expires_in * 1000));
      localStorage.setItem('expires', expiry.toString());
    }
  };

  isLoggedIn = new BehaviorSubject<boolean>(!!this.currentToken.access_token);
  isRefreshing = false;
  constructor(private http: HttpClient) { }

  async redirectToSpotifyAuthorize() {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const randomValues = crypto.getRandomValues(new Uint8Array(64));
    const randomString = randomValues.reduce((acc, x) => acc + possible[x % possible.length], "");

    const code_verifier = randomString;
    const data = new TextEncoder().encode(code_verifier);
    const hashed = await crypto.subtle.digest('SHA-256', data);

    const code_challenge_base64 = btoa(String.fromCharCode(...new Uint8Array(hashed)))
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');

    window.localStorage.setItem('code_verifier', code_verifier);

    const authUrl = new URL(this.authorizationEndpoint)
    const params = {
      response_type: 'code',
      client_id: this.clientId,
      scope: this.scope,
      code_challenge_method: 'S256',
      code_challenge: code_challenge_base64,
      redirect_uri: environment.redirectUrl,
    };

    authUrl.search = new URLSearchParams(params).toString();
    window.location.href = authUrl.toString(); // Redirect the user to the authorization server for login
  }

  isValidToken() {
    const now = new Date();
    const expireTime = new Date(this.currentToken.expires!);
    return now < expireTime ? true : false;

  }

  getToken(code: string): Observable<AuthToken> {
    const code_verifier = localStorage.getItem('code_verifier') ?? '';
    const params = new URLSearchParams({
      client_id: this.clientId,
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: environment.redirectUrl,
      code_verifier: code_verifier
    });

    return this.http.post<AuthToken>(this.tokenEndpoint, params)
      .pipe(
        //tap(_ => this.log('fetched profile')),
        catchError(this.handleError<AuthToken>('getToken'))
      );
  }

  refreshToken() {
    this.getRefreshToken().subscribe(token => {
      this.currentToken.save(token);
      this.isLoggedIn.next(!!this.currentToken.access_token);
    });
  }

  autoRefreshToken(req: HttpRequest<any>, next: HttpHandlerFn) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;

      return this.getRefreshToken().pipe(
        switchMap(token => {
          this.currentToken.save(token);
          this.isRefreshing = false;
          //Add new token header here as request will not hit interceptor again
          let modifiedReq = req.clone({
            headers: req.headers.set('Authorization', `Bearer ` + this.currentToken.access_token),
          });
          return next(modifiedReq);
        }),
        catchError((error) => {
          this.isRefreshing = false;
          //Refresh Token Issue.
          this.logout();          
          return throwError(() => error);
        })
      );
    }
    else {
      return next(req);
    }
  }

  getRefreshToken(): Observable<AuthToken> {
    const params = new URLSearchParams({
      client_id: this.clientId,
      grant_type: 'refresh_token',
      refresh_token: this.currentToken.refresh_token!
    });

    return this.http.post<AuthToken>(this.tokenEndpoint, params)
      .pipe(
        //tap(_ => this.log('fetched profile')),
        catchError((error) => {
          //Refresh Token Issue.
          if (error.status == 401) {
            this.logout();
          }
          return throwError(() => error);
        })       
      );
  }  

  logout() {
    localStorage.clear();
    this.isLoggedIn.next(!!this.currentToken.access_token);
    window.location.href = environment.redirectUrl;
  }  

  /**
* Handle Http operation that failed.
* Let the app continue.
*
* @param operation - name of the operation that failed
* @param result - optional value to return as the observable result
*/
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      //this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

}
