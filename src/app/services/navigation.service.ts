import { Injectable, signal } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

export interface Breadcrumb {
  label: string;
  url: string;
}

@Injectable({ providedIn: 'root' })
export class NavigationService {
  private breadcrumbs = signal<Breadcrumb[]>([]);
  breadcrumbs$ = this.breadcrumbs.asReadonly();

  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => this.updateBreadcrumbs());
  }

  private updateBreadcrumbs() {
    const url = this.router.url;
    const segments = url.split('/').filter(s => s);
    
    const breadcrumbs: Breadcrumb[] = [{ label: 'Home', url: '/home' }];
    
    segments.forEach((segment, index) => {
      const url = '/' + segments.slice(0, index + 1).join('/');
      const label = segment.charAt(0).toUpperCase() + segment.slice(1);
      breadcrumbs.push({ label, url });
    });

    this.breadcrumbs.set(breadcrumbs);
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }
}