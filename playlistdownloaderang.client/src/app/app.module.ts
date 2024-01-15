import { HttpClientModule, withInterceptors } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthorizationComponent } from './authorization/authorization.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { LibraryComponent } from './library/library.component';
import { authInterceptor } from './auth.interceptor';
import { PlaylistComponent } from './playlist/playlist.component';
//import { withComponentInputBinding, provideRouter } from '@angular/router';

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    LibraryComponent,
    AuthorizationComponent,
    PlaylistComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    RouterModule.forRoot([
      { path: '', component: AuthorizationComponent },
      { path: 'playlist/:id', component: PlaylistComponent }            
    ]),
    BrowserAnimationsModule
  ],
  providers: [
    provideHttpClient(
      withInterceptors([authInterceptor])
    ),
    //provideRouter(appRoutes, withComponentInputBinding()),

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
