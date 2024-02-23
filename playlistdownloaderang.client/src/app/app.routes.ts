import { Routes } from '@angular/router';
import { AuthorizationComponent } from './authorization/authorization.component';
import { PlaylistComponent } from './playlist/playlist.component';
import { LibraryComponent } from './library/library.component';

export const routes: Routes = [
  { path: '', component: AuthorizationComponent },
  { path: 'library', component: LibraryComponent },
  { path: 'playlist/:id', component: PlaylistComponent }
];
