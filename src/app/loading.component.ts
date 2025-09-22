import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="skeleton-container">
      <div class="skeleton-item" *ngFor="let item of [1,2,3]">
        <div class="skeleton-avatar"></div>
        <div class="skeleton-content">
          <div class="skeleton-line skeleton-title"></div>
          <div class="skeleton-line skeleton-text"></div>
          <div class="skeleton-line skeleton-text short"></div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .skeleton-container { padding: 20px; }
    .skeleton-item { display: flex; margin-bottom: 20px; padding: 20px; background: white; border-radius: 8px; }
    .skeleton-avatar { width: 60px; height: 60px; border-radius: 50%; background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%); background-size: 200% 100%; animation: loading 1.5s infinite; margin-right: 15px; }
    .skeleton-content { flex: 1; }
    .skeleton-line { height: 16px; border-radius: 4px; background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%); background-size: 200% 100%; animation: loading 1.5s infinite; margin-bottom: 10px; }
    .skeleton-title { height: 20px; width: 60%; }
    .skeleton-text { width: 100%; }
    .skeleton-text.short { width: 40%; }
    @keyframes loading {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
  `]
})
export class LoadingComponent {}