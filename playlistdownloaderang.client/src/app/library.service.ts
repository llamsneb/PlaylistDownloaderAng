import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CurrentUsersPlaylists } from './models/current-users-playlists.model';

@Injectable({
  providedIn: 'root'
})
export class LibraryService {
  private profileUrl = 'https://api.spotify.com/v1/me/playlists';  // URL to web api   

  constructor(
    private http: HttpClient
  ) { }

  getPlaylists(): Observable<CurrentUsersPlaylists> {
    return this.http.get<CurrentUsersPlaylists>(this.profileUrl)
      .pipe(
        catchError((error) => {
          return throwError(() => error);
        })       
      );
  }
}
