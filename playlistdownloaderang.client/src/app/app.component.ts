import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthorizationService } from '../app/authorization.service';
import { RouterOutlet } from '@angular/router';
import { LibraryComponent } from './library/library.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    standalone: true,
    imports: [NavBarComponent, LibraryComponent, RouterOutlet]
})
export class AppComponent implements OnInit {
  constructor(
    private http: HttpClient,
    public authorizationService: AuthorizationService
  ) { }

  ngOnInit() {
    /**
    * This is an example of a basic node.js script that performs
    * the Authorization Code with PKCE oAuth2 flow to authenticate 
    * against the Spotify Accounts.
    *
    * For more information, read
    * https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow
    */

    // On page load, try to fetch auth code from current browser search URL
    const args = new URLSearchParams(window.location.search);
    const code = args.get('code');

    // If we find a code, we're in a callback, do a token exchange
    if (code) {
      this.authorizationService.getToken(code).subscribe(token => { 
        this.authorizationService.currentToken.save(token);
        this.authorizationService.isLoggedIn.next(!!this.authorizationService.currentToken.access_token)      

        // Remove code from URL so we can refresh correctly.
        const url = new URL(window.location.href);
        url.searchParams.delete("code");

        const updatedUrl = url.search ? url.href : url.href.replace('?', '');
        window.history.replaceState({}, document.title, updatedUrl);
      });
    }
  }

  title = 'playlistdownloaderang.client';
}
