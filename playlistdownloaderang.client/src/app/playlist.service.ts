import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Playlist } from './models/playlist.model';

@Injectable({
  providedIn: 'root'
})
export class PlaylistService {
  constructor(
    private http: HttpClient
  ) { }

  getPlaylist(playlist_id:string): Observable<Playlist> {
    const profileUrl = `https://api.spotify.com/v1/me/playlists/${playlist_id}`;  // URL to web api  
    return this.http.get<Playlist>(profileUrl)
      .pipe(
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }
}
