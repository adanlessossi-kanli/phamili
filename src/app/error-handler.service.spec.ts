import { TestBed } from '@angular/core/testing';
import { GlobalErrorHandler } from './error-handler.service';
import { NotificationService } from './notification.service';

describe('GlobalErrorHandler', () => {
  let service: GlobalErrorHandler;
  let notificationService: jasmine.SpyObj<NotificationService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('NotificationService', ['error']);
    TestBed.configureTestingModule({
      providers: [
        GlobalErrorHandler,
        { provide: NotificationService, useValue: spy }
      ]
    });
    service = TestBed.inject(GlobalErrorHandler);
    notificationService = TestBed.inject(NotificationService) as jasmine.SpyObj<NotificationService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should handle error', () => {
    spyOn(console, 'error');
    const error = new Error('Test error');
    service.handleError(error);
    expect(console.error).toHaveBeenCalledWith('Global error caught:', error);
    expect(notificationService.error).toHaveBeenCalled();
  });
});