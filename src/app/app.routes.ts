import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', loadComponent: () => import('./home.component').then(m => m.HomeComponent) },
  { path: 'login', loadComponent: () => import('./login.component').then(m => m.LoginComponent) },
  { 
    path: 'blog', 
    loadComponent: () => import('./blog.component').then(m => m.BlogComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'media', 
    loadComponent: () => import('./media.component').then(m => m.MediaComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'about', 
    loadComponent: () => import('./about.component').then(m => m.AboutComponent)
  },
  { path: '**', loadComponent: () => import('./not-found.component').then(m => m.NotFoundComponent) }
];