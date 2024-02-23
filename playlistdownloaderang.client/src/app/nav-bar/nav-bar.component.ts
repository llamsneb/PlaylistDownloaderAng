import { Component} from '@angular/core';
import { AuthorizationService } from '../authorization.service';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgClass, NgIf, AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss',
  standalone: true,
  imports: [NgClass, RouterLink, RouterLinkActive, NgIf, AsyncPipe]
})
export class NavBarComponent {
  responsive: boolean = false; 
  constructor(
    public authorizationService: AuthorizationService
  ) { }

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
  }
}
