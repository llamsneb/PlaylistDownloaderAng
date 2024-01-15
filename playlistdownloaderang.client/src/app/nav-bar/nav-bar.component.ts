import { Component, OnInit } from '@angular/core';
import { AuthorizationService } from '../authorization.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss'
})
export class NavBarComponent implements OnInit {
  responsive: boolean = false; 
  constructor(
    public authorizationService: AuthorizationService
  ) { }

  async ngOnInit() {
    
  }

  //openNav() {
  //  document.getElementById("myNav").style.width = "100%";
  //}

  //closeNav() {
  //  document.getElementById("myNav").style.width = "0%";
  //}
  //myFunction() {
  //  //const x = document.getElementById("nav");
  //  //if (x.className === "nav-bar") {
  //  //  x.className += " responsive";
  //  //} else {
  //  //  x.className = "topnav";
  //  //}
  //}

  // Click handlers
  async loginWithSpotifyClick() {
    await this.authorizationService.redirectToSpotifyAuthorize();
  //  window.location.reload();
  }

}
