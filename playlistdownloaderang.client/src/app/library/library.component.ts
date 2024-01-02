import { Component, OnInit } from '@angular/core';
import { AuthorizationService } from '../authorization.service';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrl: './library.component.scss'
})
export class LibraryComponent {
  playLists: any = {};

  constructor(
    public authorizationService: AuthorizationService
  ) { }

  async ngOnInit() {
    //If we have a token, we're logged in, so fetch user data    
    if (this.authorizationService.currentToken.access_token != null) {
      if (!this.authorizationService.isValidToken()) {
        this.authorizationService.refreshToken();
      }

      this.playLists = await this.getPlaylists();
    }
  }

  async getPlaylists() {
    const response = await fetch("https://api.spotify.com/v1/me/playlists ", {
      method: 'GET',
      headers: { 'Authorization': 'Bearer ' + this.authorizationService.currentToken.access_token },
    });

    return await response.json();
  }
}
