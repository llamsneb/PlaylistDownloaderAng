import { Component, OnInit, Input } from '@angular/core';
//import { AuthorizationService } from '../authorization.service';
import { PlaylistService } from '../playlist.service';
import { Playlist } from '../models/playlist.model';
//import { ActivatedRoute } from 
@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrl: './playlist.component.scss'
})
export class PlaylistComponent {
  playlist: Playlist|null = null;
  playlist_id: string = '';
  constructor(
    //public authorizationService: AuthorizationService,
    public libraryService: PlaylistService
  ) { }

  ngOnInit() {
    //@Input() set playlist_id(this.playlist_id: string) {
    //  this.playlist_id$ = this.getPlaylist(heroId);
    //}

    //this.route.paramMap.subscribe(paramMap => {
    //  this.bankName = paramMap.get('bank');
    //})


    this.getPlaylist(this.playlist_id);
  }

  getPlaylist(playlist_id:string): void {
    this.libraryService.getPlaylist(playlist_id)
      .subscribe(playlist =>
        this.playlist = playlist);
  }
}
