import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { 
    path: 'home', 
    loadComponent: () => import('./home.component').then(m => m.HomeComponent),
    title: 'Home - Phamili' 
  },
  { 
    path: 'blog', 
    loadComponent: () => import('./blog.component').then(m => m.BlogComponent),
    title: 'Blog - Phamili' 
  },
  { 
    path: 'media', 
    loadComponent: () => import('./media.component').then(m => m.MediaComponent),
    title: 'Media - Phamili' 
  },
  { 
    path: 'about', 
    loadComponent: () => import('./about.component').then(m => m.AboutComponent),
    title: 'About - Phamili' 
  },
  { 
    path: 'login', 
    loadComponent: () => import('./login.component').then(m => m.LoginComponent),
    title: 'Login - Phamili' 
  },
  { 
    path: '**', 
    loadComponent: () => import('./not-found.component').then(m => m.NotFoundComponent),
    title: '404 - Page Not Found' 
  }
];
