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
    
    spyOn(localStorage, 'getItem').and.returnValue('[]');
    spyOn(localStorage, 'setItem');
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

  it('should store error in localStorage', () => {
    const error = new Error('Test error');
    spyOn(console, 'error');

    service.handleError(error);

    expect(localStorage.setItem).toHaveBeenCalledWith('app_errors', jasmine.any(String));
  });

  it('should handle localStorage errors gracefully', () => {
    const error = new Error('Test error');
    spyOn(console, 'error');
    spyOn(console, 'warn');
    (localStorage.setItem as jasmine.Spy).and.throwError('Storage error');

    expect(() => service.handleError(error)).not.toThrow();
    expect(console.warn).toHaveBeenCalledWith('Failed to store error:', jasmine.any(Error));
  });

  it('should limit stored errors to 10', () => {
    const existingErrors = Array(10).fill({ message: 'Old error' });
    (localStorage.getItem as jasmine.Spy).and.returnValue(JSON.stringify(existingErrors));
    
    const error = new Error('New error');
    spyOn(console, 'error');

    service.handleError(error);

    const storedData = (localStorage.setItem as jasmine.Spy).calls.mostRecent().args[1];
    const errors = JSON.parse(storedData);
    expect(errors.length).toBe(10);
  });

  it('should send error to Sentry if available', () => {
    const error = new Error('Test error');
    const mockSentry = { captureException: jasmine.createSpy('captureException') };
    (window as any).Sentry = mockSentry;
    spyOn(console, 'error');

    service.handleError(error);

    expect(mockSentry.captureException).toHaveBeenCalledWith(error);
    
    delete (window as any).Sentry;
  });

  it('should handle invalid JSON in localStorage', () => {
    (localStorage.getItem as jasmine.Spy).and.returnValue('invalid json');
    const error = new Error('Test error');
    spyOn(console, 'error');

    expect(() => service.handleError(error)).not.toThrow();
  });

  it('should handle null localStorage value', () => {
    (localStorage.getItem as jasmine.Spy).and.returnValue(null);
    const error = new Error('Test error');
    spyOn(console, 'error');

    service.handleError(error);

    expect(localStorage.setItem).toHaveBeenCalled();
  });
});