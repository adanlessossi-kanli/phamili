import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from './data.service';

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
            <input type="text" placeholder="Search..." (input)="onSearch($event)" />
          </div>
          <div class="user-menu">
            <button class="theme-toggle" (click)="toggleTheme()">
              {{dataService.theme() === 'light' ? '🌙' : '☀️'}}
            </button>
            <div class="notifications">🔔</div>
            <div class="user-avatar">👤</div>
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
    .notifications, .user-avatar, .theme-toggle {
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
  `]
})
export class HeaderComponent {
  dataService = inject(DataService);

  toggleTheme() {
    this.dataService.toggleTheme();
  }

  onSearch(event: any) {
    const query = event.target.value;
    console.log('Search:', query);
  }
}