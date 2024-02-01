import { Component, Input, OnChanges } from '@angular/core';
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

export class PlaylistComponent implements OnChanges {
  playlist$!: Observable<Playlist>;
  playlist!: Playlist;
  totaltime!: string;
  frameUrl!: string;

  @Input() set id(id: string) {
    this.playlist$ = this.playlistService.getPlaylist(id);
    this.frameUrl = "https://open.spotify.com/embed/playlist/" + id + "?utm_source=generator"; 
  }
  constructor(
    public playlistService: PlaylistService
  ) { }

  ngOnChanges() {
    //this.playlist$.subscribe(pl => {
    //  this.playlist = pl;
    //  var duration = this.playlist.tracks.items
    //    .reduce((total: number, obj: any) => obj.track.duration_ms + total, 0);
    //  this.totaltime = this.msToTime(duration)
    //});      
  }

  //msToTime(duration:number) {
  //  var milliseconds = Math.floor((duration % 1000) / 100);
  //  var seconds = Math.floor((duration / 1000) % 60);
  //  var minutes = Math.floor((duration / (1000 * 60)) % 60);
  //  var hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
 
  //  var hoursAsStr = (hours == 0) ? "" : hours + " hr ";
  //  var minutesAsStr = (minutes == 0) ? "" : minutes + " min ";
  //  var secondsAsStr = (seconds == 0) ? "" : seconds + " sec";  

  //  return hoursAsStr + minutesAsStr + secondsAsStr;
  //}
}
