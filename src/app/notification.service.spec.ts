import { TestBed } from '@angular/core/testing';
import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should show notification', () => {
    const id = service.show('Test message', 'success');
    expect(service.notifications$().length).toBe(1);
    expect(service.notifications$()[0].message).toBe('Test message');
    expect(id).toBeTruthy();
  });

  it('should remove notification', () => {
    const id = service.show('Test message');
    service.remove(id);
    expect(service.notifications$().length).toBe(0);
  });

  it('should auto-remove notification after duration', (done) => {
    service.show('Test message', 'info', 100);
    setTimeout(() => {
      expect(service.notifications$().length).toBe(0);
      done();
    }, 150);
  });

  it('should show success notification', () => {
    service.success('Success message');
    expect(service.notifications$().length).toBe(1);
    expect(service.notifications$()[0].type).toBe('success');
  });

  it('should show error notification', () => {
    service.error('Error message');
    expect(service.notifications$().length).toBe(1);
    expect(service.notifications$()[0].type).toBe('error');
  });

  it('should show info notification', () => {
    service.info('Info message');
    expect(service.notifications$().length).toBe(1);
    expect(service.notifications$()[0].type).toBe('info');
  });

  it('should show warning notification', () => {
    service.warning('Warning message');
    expect(service.notifications$().length).toBe(1);
    expect(service.notifications$()[0].type).toBe('warning');
  });

  it('should clear all notifications', () => {
    service.success('Test 1');
    service.error('Test 2');
    service.clearAll();
    expect(service.notifications$().length).toBe(0);
  });
});