import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { CurrentUsersProfile } from './models/current-users-profile.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private profileUrl = 'https://api.spotify.com/v1/me';  // URL to web api   

  constructor(
    private http: HttpClient
  ) { }

  /** GET heroes from the server */
  //getHeroes(): Observable<Hero[]> {
  //  return this.http.get<Hero[]>(this.heroesUrl)
  //    .pipe(
  //      tap(_ => this.log('fetched heroes')),
  //      catchError(this.handleError<Hero[]>('getHeroes', []))
  //    );
  //}

  getUserData(): Observable<CurrentUsersProfile> {
    return this.http.get<CurrentUsersProfile>(this.profileUrl)
      .pipe(
        //tap(_ => this.log('fetched profile')),
        catchError(this.handleError<CurrentUsersProfile>('getUserData'))
      );
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

  /** Log a HeroService message with the MessageService */
  //private log(message: string) {
  //  this.messageService.add(`HeroService: ${message}`);
  //}
}
