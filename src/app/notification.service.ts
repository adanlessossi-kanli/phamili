import { Injectable, signal } from '@angular/core';

export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications = signal<Notification[]>([]);
  notifications$ = this.notifications.asReadonly();

  show(message: string, type: Notification['type'] = 'info', duration = 3000) {
    const id = Date.now().toString();
    const notification: Notification = { id, message, type, duration };
    
    this.notifications.update(notifications => [...notifications, notification]);
    
    if (duration > 0) {
      setTimeout(() => this.remove(id), duration);
    }
    
    return id;
  }

  remove(id: string) {
    this.notifications.update(notifications => 
      notifications.filter(n => n.id !== id)
    );
  }

  success(message: string) { return this.show(message, 'success'); }
  error(message: string) { return this.show(message, 'error'); }
  warning(message: string) { return this.show(message, 'warning'); }
  info(message: string) { return this.show(message, 'info'); }
}