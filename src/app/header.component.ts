import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DataService } from './data.service';
import { AuthService } from './auth.service';
import { SearchService } from './search.service';
import { NotificationService } from './notification.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="header">
      <div class="header-content">
        <div class="header-left">
          <h2>Phamili</h2>
        </div>
        <div class="header-right">
          <div class="search-box">
            <input type="text" placeholder="Search..." (input)="onSearch($event)" (keyup.enter)="performSearch()" />
            <div class="search-results" *ngIf="searchResults && searchQuery">
              <div class="search-section" *ngIf="searchResults.posts.length">
                <h4>Posts</h4>
                <div *ngFor="let post of searchResults.posts" class="search-item" (click)="navigateToPost(post)">
                  {{post.title}}
                </div>
              </div>
              <div class="search-section" *ngIf="searchResults.media.length">
                <h4>Media</h4>
                <div *ngFor="let item of searchResults.media" class="search-item" (click)="navigateToMedia()">
                  {{item.title}}
                </div>
              </div>
            </div>
          </div>
          <div class="user-menu">
            <button class="theme-toggle" (click)="toggleTheme()">
              {{dataService.theme() === 'light' ? '🌙' : '☀️'}}
            </button>
            <div class="notifications" (click)="showNotification()">🔔</div>
            <div class="user-section" *ngIf="authService.isAuthenticated$(); else loginSection">
              <div class="user-avatar" (click)="toggleUserMenu()">
                {{authService.user$()?.avatar || '👤'}}
              </div>
              <div class="user-dropdown" *ngIf="showUserMenu">
                <div class="user-info">
                  <strong>{{authService.user$()?.name}}</strong>
                  <small>{{authService.user$()?.email}}</small>
                </div>
                <button (click)="logout()">Logout</button>
              </div>
            </div>
            <ng-template #loginSection>
              <button class="login-btn" (click)="goToLogin()">Login</button>
            </ng-template>
          </div>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .header {
      background: white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      position: fixed;
      top: 0;
      left: 250px;
      right: 0;
      height: 60px;
      z-index: 999;
      transition: left 0.3s;
    }
    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 30px;
      height: 100%;
    }
    .header-left h2 {
      margin: 0;
      color: #2c3e50;
    }
    .header-right {
      display: flex;
      align-items: center;
      gap: 20px;
    }
    .search-box input {
      padding: 8px 15px;
      border: 1px solid #ddd;
      border-radius: 20px;
      outline: none;
      width: 250px;
    }
    .user-menu {
      display: flex;
      align-items: center;
      gap: 15px;
    }
    .notifications, .user-avatar, .theme-toggle, .login-btn {
      font-size: 20px;
      cursor: pointer;
      padding: 8px;
      border-radius: 50%;
      transition: background 0.3s;
      background: none;
      border: none;
    }
    .notifications:hover, .user-avatar:hover, .theme-toggle:hover {
      background: #f8f9fa;
    }
    .login-btn {
      background: #2c3e50;
      color: white;
      border-radius: 20px;
      padding: 8px 16px;
      font-size: 14px;
    }
    .search-box {
      position: relative;
    }
    .search-results {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: white;
      border: 1px solid #ddd;
      border-radius: 4px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
      max-height: 300px;
      overflow-y: auto;
      z-index: 1000;
    }
    .search-section h4 {
      margin: 10px;
      color: #2c3e50;
      font-size: 12px;
      text-transform: uppercase;
    }
    .search-item {
      padding: 10px;
      cursor: pointer;
      border-bottom: 1px solid #f0f0f0;
    }
    .search-item:hover {
      background: #f8f9fa;
    }
    .user-section {
      position: relative;
    }
    .user-dropdown {
      position: absolute;
      top: 100%;
      right: 0;
      background: white;
      border: 1px solid #ddd;
      border-radius: 4px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
      padding: 15px;
      min-width: 200px;
      z-index: 1000;
    }
    .user-info {
      margin-bottom: 10px;
    }
    .user-info small {
      display: block;
      color: #666;
    }
    .user-dropdown button {
      width: 100%;
      padding: 8px;
      background: #dc3545;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
  `]
})
export class HeaderComponent {
  dataService = inject(DataService);
  authService = inject(AuthService);
  searchService = inject(SearchService);
  notificationService = inject(NotificationService);
  router = inject(Router);

  searchQuery = '';
  searchResults: any = null;
  showUserMenu = false;

  ngOnInit() {
    this.authService.checkAuth();
  }

  toggleTheme() {
    this.dataService.toggleTheme();
  }

  onSearch(event: any) {
    this.searchQuery = event.target.value;
    if (this.searchQuery.length > 2) {
      this.searchResults = this.searchService.search(this.searchQuery);
    } else {
      this.searchResults = null;
    }
  }

  performSearch() {
    if (this.searchQuery) {
      this.router.navigate(['/search'], { queryParams: { q: this.searchQuery } });
      this.searchResults = null;
    }
  }

  navigateToPost(post: any) {
    this.router.navigate(['/blog']);
    this.searchResults = null;
  }

  navigateToMedia() {
    this.router.navigate(['/media']);
    this.searchResults = null;
  }

  showNotification() {
    this.notificationService.info('You have no new notifications');
  }

  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
  }

  logout() {
    this.authService.logout();
    this.showUserMenu = false;
    this.notificationService.success('Logged out successfully');
    this.router.navigate(['/home']);
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}