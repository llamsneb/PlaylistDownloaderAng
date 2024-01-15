import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthorizationService } from '../app/authorization.service';
import { AuthToken } from './models/auth-token.model';

//interface WeatherForecast {
//  date: string;
//  temperatureC: number;
//  temperatureF: number;
//  summary: string;
//}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  //public forecasts: WeatherForecast[] = [];

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

    //console.log('test');
    //this.getForecasts();
  }

  //getForecasts() {
  //  this.http.get<WeatherForecast[]>('/weatherforecast').subscribe(
  //    (result) => {
  //      this.forecasts = result;
  //    },
  //    (error) => {
  //      console.error(error);
  //    }
  //  );
  //}

  title = 'playlistdownloaderang.client';
}
