import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { I18nService } from './i18n.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="sidebar" [class.collapsed]="isCollapsed">
      <div class="sidebar-header">
        <h3 *ngIf="!isCollapsed">Phamili</h3>
        <button class="toggle-btn" (click)="toggleSidebar()">☰</button>
      </div>
      <nav class="sidebar-nav">
        <a *ngFor="let item of menuItems" 
           [routerLink]="item.route" 
           class="nav-item"
           routerLinkActive="active">
          <span class="icon">{{item.icon}}</span>
          <span class="label" *ngIf="!isCollapsed">{{i18n.translate(item.labelKey)}}</span>
        </a>
      </nav>
    </div>
  `,
  styles: [`
    .sidebar {
      width: 250px;
      height: 100vh;
      background: #2c3e50;
      color: white;
      transition: width 0.3s;
      position: fixed;
      left: 0;
      top: 0;
      z-index: 1000;
    }
    @media (max-width: 768px) {
      .sidebar {
        transform: translateX(-100%);
      }
      .sidebar.mobile-open {
        transform: translateX(0);
      }
    }
    .sidebar.collapsed {
      width: 60px;
    }
    .sidebar-header {
      padding: 20px;
      border-bottom: 1px solid #34495e;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .toggle-btn {
      background: none;
      border: none;
      color: white;
      font-size: 18px;
      cursor: pointer;
    }
    .sidebar-nav {
      padding: 20px 0;
    }
    .nav-item {
      display: flex;
      align-items: center;
      padding: 15px 20px;
      color: #bdc3c7;
      text-decoration: none;
      transition: all 0.3s;
    }
    .nav-item:hover, .nav-item.active {
      background: #34495e;
      color: white;
    }
    .icon {
      font-size: 20px;
      margin-right: 15px;
    }
    .collapsed .label {
      display: none;
    }
  `]
})
export class SidebarComponent {
  i18n = inject(I18nService);
  
  menuItems = [
    { icon: '🏠', labelKey: 'nav.home', route: '/home' },
    { icon: '📝', labelKey: 'nav.blog', route: '/blog' },
    { icon: '🎬', labelKey: 'nav.media', route: '/media' },
    { icon: 'ℹ️', labelKey: 'nav.about', route: '/about' }
  ];

  isCollapsed = false;

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }
}