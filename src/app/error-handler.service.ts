import { Injectable, ErrorHandler } from '@angular/core';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class GlobalErrorHandler implements ErrorHandler {
  constructor(private notificationService: NotificationService) {}

  handleError(error: any): void {
    console.error('Global error caught:', error);
    
    const errorInfo = {
      message: error.message || 'Unknown error',
      stack: error.stack,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent
    };
    
    // Store error locally for debugging
    this.storeError(errorInfo);
    
    // Show user-friendly error message
    this.notificationService.error('Something went wrong. Please try again.');
    
    // Send to error tracking service in production
    if (typeof window !== 'undefined' && (window as any).Sentry) {
      (window as any).Sentry.captureException(error);
    }
  }

  private storeError(errorInfo: any) {
    try {
      const errors = JSON.parse(localStorage.getItem('app_errors') || '[]');
      errors.push(errorInfo);
      // Keep only last 10 errors
      if (errors.length > 10) errors.shift();
      localStorage.setItem('app_errors', JSON.stringify(errors));
    } catch (e) {
      console.warn('Failed to store error:', e);
    }
  }
}