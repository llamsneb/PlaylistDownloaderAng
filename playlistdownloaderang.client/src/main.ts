import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';


import { importProvidersFrom } from '@angular/core';
import { AppComponent } from './app/app.component';
import { provideAnimations } from '@angular/platform-browser/animations';
import { PlaylistComponent } from './app/playlist/playlist.component';
import { AuthorizationComponent } from './app/authorization/authorization.component';
import { provideRouter } from '@angular/router';
import { AppRoutingModule } from './app/app-routing.module';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { authInterceptor } from './app/auth.interceptor';
import { provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';


bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(BrowserModule, AppRoutingModule),
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClient(withInterceptorsFromDi()),
        provideRouter([
            { path: '', component: AuthorizationComponent },
            { path: 'playlist/:id', component: PlaylistComponent }
        ]),
        provideAnimations()
    ]
})
  .catch(err => console.error(err));
