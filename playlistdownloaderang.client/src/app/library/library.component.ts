import { Component, OnInit } from '@angular/core';
import { AuthorizationService } from '../authorization.service';
import { LibraryService } from '../library.service';
import { RouterLinkActive, RouterLink } from '@angular/router';
import { NgFor } from '@angular/common';

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
    public libraryService: LibraryService
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
}
