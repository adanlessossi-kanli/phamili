import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError, retry, timer } from 'rxjs';
import { NotificationService } from '../notification.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notificationService = inject(NotificationService);
  
  return next(req).pipe(
    retry({
      count: 3,
      delay: (error, retryCount) => {
        if (error.status >= 500) {
          return timer(Math.pow(2, retryCount) * 1000);
        }
        throw error;
      }
    }),
    catchError(error => {
      switch (error.status) {
        case 401:
          notificationService.error('Session expired. Please login again.');
          break;
        case 403:
          notificationService.error('Access forbidden.');
          break;
        case 404:
          notificationService.error('Resource not found.');
          break;
        case 500:
          notificationService.error('Server error. Please try again later.');
          break;
        default:
          notificationService.error('An error occurred.');
      }
      return throwError(() => error);
    })
  );
};