import { Component, OnInit } from '@angular/core';
import { AuthorizationService } from '../authorization.service';

@Component({
  selector: 'app-authorization',
  templateUrl: './authorization.component.html',
  styleUrl: './authorization.component.scss'
})

export class AuthorizationComponent implements OnInit {
  userData: any = {};

  constructor(
    public authorizationService: AuthorizationService
  ) { }

  async ngOnInit() {
    //If we have a token, we're logged in, so fetch user data    
    if (this.authorizationService.hasToken()) {
      if (!this.authorizationService.isValidToken()) {
        this.authorizationService.refreshToken();
      }

      this.userData = await this.getUserData();
    }       
  }

  async getUserData() {
    const response = await fetch("https://api.spotify.com/v1/me", {
      method: 'GET',
      headers: { 'Authorization': 'Bearer ' + this.authorizationService.currentToken.access_token },
    });

    return await response.json();
  }    
}
