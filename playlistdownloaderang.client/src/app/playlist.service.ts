import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, pipe, map } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Playlist } from './models/playlist.model';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PlaylistService {
  constructor(
    private http: HttpClient
  ) { }

  getPlaylist(playlist_id:string): Observable<Playlist> {
    const profileUrl = `https://api.spotify.com/v1/playlists/${playlist_id}`;  // URL to web api  
    return this.http.get<Playlist>(profileUrl)
      .pipe(
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }

  downloadPlaylist(id: string): void {
    this.getPlaylist(id).subscribe(pl => {
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        'responseType': 'blob' as 'json'
      };

      //this.http.get('/export').pipe(
      //  catchError((error) => {
      //    return throwError(() => error);
      //  })
      //).subscribe();

      this.http.post<Blob>(environment.exportApi, pl, httpOptions)
        .pipe(
          map(res => {
            var downloadURL = URL.createObjectURL(res);
            var link = document.createElement('a');
            link.href = downloadURL;
            link.download = pl.name + "_playlist.xlsx";
            link.click();
          }),
          catchError((error) => {
            return throwError(() => error);
          })
        ).subscribe();
    })
  }
}
