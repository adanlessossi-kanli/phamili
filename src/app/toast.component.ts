import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from './notification.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      <div *ngFor="let notification of notificationService.notifications$()" 
           class="toast" 
           [class]="'toast-' + notification.type"
           (click)="notificationService.remove(notification.id)">
        <span class="toast-icon">{{getIcon(notification.type)}}</span>
        <span class="toast-message">{{notification.message}}</span>
        <button class="toast-close" (click)="notificationService.remove(notification.id)">×</button>
      </div>
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .toast {
      display: flex;
      align-items: center;
      padding: 12px 16px;
      border-radius: 6px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      cursor: pointer;
      animation: slideIn 0.3s ease-out;
      min-width: 300px;
      max-width: 400px;
    }
    .toast-success { background: #d4edda; color: #155724; border-left: 4px solid #28a745; }
    .toast-error { background: #f8d7da; color: #721c24; border-left: 4px solid #dc3545; }
    .toast-warning { background: #fff3cd; color: #856404; border-left: 4px solid #ffc107; }
    .toast-info { background: #d1ecf1; color: #0c5460; border-left: 4px solid #17a2b8; }
    .toast-icon { margin-right: 10px; font-size: 16px; }
    .toast-message { flex: 1; }
    .toast-close { background: none; border: none; font-size: 18px; cursor: pointer; margin-left: 10px; }
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `]
})
export class ToastComponent {
  notificationService = inject(NotificationService);

  getIcon(type: string): string {
    const icons = {
      success: '✓',
      error: '✗',
      warning: '⚠',
      info: 'ℹ'
    };
    return icons[type as keyof typeof icons] || 'ℹ';
  }
}