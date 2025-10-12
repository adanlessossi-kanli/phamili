import { TestBed } from '@angular/core/testing';
import { HttpRequest, HttpHandler, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { errorInterceptor } from './error.interceptor';
import { NotificationService } from '../notification.service';

describe('errorInterceptor', () => {
  let mockNotificationService: jasmine.SpyObj<NotificationService>;
  let mockHandler: jasmine.SpyObj<HttpHandler>;
  let mockRequest: HttpRequest<any>;

  beforeEach(() => {
    const notificationSpy = jasmine.createSpyObj('NotificationService', ['error']);
    const handlerSpy = jasmine.createSpyObj('HttpHandler', ['handle']);

    TestBed.configureTestingModule({
      providers: [{ provide: NotificationService, useValue: notificationSpy }]
    });

    mockNotificationService = TestBed.inject(NotificationService) as jasmine.SpyObj<NotificationService>;
    mockHandler = handlerSpy;
    mockRequest = new HttpRequest('GET', '/test');
  });

  it('should handle 401 errors', () => {
    const error = new HttpErrorResponse({ status: 401 });
    mockHandler.handle.and.returnValue(throwError(() => error));
    
    TestBed.runInInjectionContext(() => {
      errorInterceptor(mockRequest, mockHandler.handle).subscribe({
        error: () => {}
      });
    });
    
    expect(mockNotificationService.error).toHaveBeenCalledWith('Session expired. Please login again.');
  });

  it('should handle 500+ errors', () => {
    const error = new HttpErrorResponse({ status: 500 });
    mockHandler.handle.and.returnValue(throwError(() => error));
    
    TestBed.runInInjectionContext(() => {
      errorInterceptor(mockRequest, mockHandler.handle).subscribe({
        next: () => {},
        error: () => {
          expect(mockNotificationService.error).toHaveBeenCalledWith('Server error. Please try again later.');
        }
      });
    });
  });

  it('should pass through successful requests', () => {
    const mockResponse = new HttpResponse({ body: { data: 'test' } });
    mockHandler.handle.and.returnValue(of(mockResponse));
    
    TestBed.runInInjectionContext(() => {
      errorInterceptor(mockRequest, mockHandler.handle).subscribe();
    });
    
    expect(mockNotificationService.error).not.toHaveBeenCalled();
  });
});