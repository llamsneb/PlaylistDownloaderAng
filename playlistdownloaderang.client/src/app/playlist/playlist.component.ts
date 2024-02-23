import { Component, Input } from '@angular/core';
import { PlaylistService } from '../playlist.service';
import { Playlist } from '../models/playlist.model';
import { Observable, throwError } from 'rxjs';
import { RouterLink } from '@angular/router';
import { NgFor, NgIf, AsyncPipe, DatePipe } from '@angular/common';
import { UrlPipe } from '../url.pipe';

@Component({
    selector: 'app-playlist',
    templateUrl: './playlist.component.html',
    styleUrl: './playlist.component.scss',
    imports: [NgFor, NgIf, AsyncPipe, RouterLink, DatePipe, UrlPipe],
    standalone: true
})

export class PlaylistComponent {
  playlist$!: Observable<Playlist>;
  frameUrl!: string;

  @Input() set id(id: string) {
    this.playlist$ = this.playlistService.getPlaylist(id);
    this.frameUrl = "https://open.spotify.com/embed/playlist/" + id + "?utm_source=generator"; 
  }
  constructor(
    public playlistService: PlaylistService
  ) { }
}
