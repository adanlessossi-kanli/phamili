import { Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { BlogComponent } from './blog.component';
import { MediaComponent } from './media.component';
import { AboutComponent } from './about.component';
import { NotFoundComponent } from './not-found.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, title: 'Home - Phamili' },
  { path: 'blog', component: BlogComponent, title: 'Blog - Phamili' },
  { path: 'media', component: MediaComponent, title: 'Media - Phamili' },
  { path: 'about', component: AboutComponent, title: 'About - Phamili' },
  { path: '**', component: NotFoundComponent, title: '404 - Page Not Found' }
];
