import { Component, OnInit } from '@angular/core';
import { AuthorizationService } from '../authorization.service';
import { LibraryService } from '../library.service';
import { PlaylistService } from '../playlist.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, pipe, map } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { RouterLinkActive, RouterLink } from '@angular/router';
import { NgFor } from '@angular/common';
import { Playlist } from '../models/playlist.model';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrl: './library.component.scss',
  standalone: true,
  imports: [NgFor, RouterLinkActive, RouterLink]
})
export class LibraryComponent {
  playlists: any = {};
  constructor(
    public authorizationService: AuthorizationService,
    public libraryService: LibraryService,
    public playlistService: PlaylistService,
    private http: HttpClient
  ) { }

  ngOnInit() {
    //If we have a token, we're logged in, so fetch user data
    this.authorizationService.isLoggedIn.subscribe(val => {
      if (val) {
        this.getPlaylists()
      }
    });
  }

  getPlaylists(): void {
    this.libraryService.getPlaylists()
      .subscribe(playlists =>
        this.playlists = playlists);
  }

  downloadPlaylist(id: string): void {
    this.playlistService.getPlaylist(id).subscribe(pl => {
      const httpOptions = {
        headers: new HttpHeaders({
          //'Authorization': 'Bearer ' + this.currentToken.access_token,
          'Content-Type': 'application/json',            
        }),
        'responseType': 'blob' as 'json'
      };
      const params = new URLSearchParams({
        id: id
      });

      //this.http.get('/export').pipe(
      //  catchError((error) => {
      //    return throwError(() => error);
      //  })
      //).subscribe();

      this.http.post<Blob>('/export', pl, httpOptions)
        .pipe(
          map(res => {
            //const blob = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

            var downloadURL = URL.createObjectURL(res);
            var link = document.createElement('a');
            link.href = downloadURL;
            link.download = pl.name + "_playlist.xlsx";
            link.click();
          }),
          catchError((error) => {
            return throwError(() => error);
          })
      )
      .subscribe();
    })
  }
}
