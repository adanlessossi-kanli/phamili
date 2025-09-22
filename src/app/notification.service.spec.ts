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
});