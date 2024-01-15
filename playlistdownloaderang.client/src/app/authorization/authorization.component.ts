import { Component, OnInit } from '@angular/core';

import { AuthorizationService } from '../authorization.service';
import { ProfileService } from '../profile.service';

@Component({
  selector: 'app-authorization',
  templateUrl: './authorization.component.html',
  styleUrl: './authorization.component.scss'
})

export class AuthorizationComponent implements OnInit {
  userData: any = {};

  constructor(
    public authorizationService: AuthorizationService,
    public profileService: ProfileService
  ) { }

  ngOnInit() {   
    //If we have a token, we're logged in, so fetch user data
    this.authorizationService.isLoggedIn.subscribe(val => {
      if (val) {
        this.getUserData()
      }
    });
  }  

  getUserData(): void {
    this.profileService.getUserData()
      .subscribe(userData =>
        this.userData = userData);
  } 
}
