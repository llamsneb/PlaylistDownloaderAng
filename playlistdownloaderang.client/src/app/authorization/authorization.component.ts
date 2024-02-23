import { Component, OnInit } from '@angular/core';
import { AuthorizationService } from '../authorization.service';
import { ProfileService } from '../profile.service';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PlaylistService } from '../playlist.service';

@Component({
    selector: 'app-authorization',
    templateUrl: './authorization.component.html',
    styleUrl: './authorization.component.scss',
    standalone: true,
  imports: [NgIf, NgFor, AsyncPipe, RouterLink]
})

export class AuthorizationComponent implements OnInit {
  userData: any = {};
  featPlaylists: any = {};

  constructor(
    public authorizationService: AuthorizationService,
    public profileService: ProfileService,
    public playlistService: PlaylistService,
  ) { }

  ngOnInit() {   
    //If we have a token, we're logged in, so fetch user data
    this.authorizationService.isLoggedIn.subscribe(val => {
      if (val) {
        this.getUserData();
        this.getFeatPlaylists();
      }
    });
  }  

  getUserData(): void {
    this.profileService.getUserData()
      .subscribe(userData =>
        this.userData = userData);
  }

  getFeatPlaylists(): void {
    this.profileService.getFeatPlaylists()
      .subscribe(featPlaylists =>
        this.featPlaylists = featPlaylists);
  }
}
