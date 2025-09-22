import { TestBed } from '@angular/core/testing';
import { WebSocketService } from './websocket.service';

describe('WebSocketService', () => {
  let service: WebSocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebSocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send notification', () => {
    spyOn(service, 'send');
    service.sendNotification('info', 'test message');
    expect(service.send).toHaveBeenCalled();
  });

  it('should send comment', () => {
    spyOn(service, 'send');
    service.sendComment('1', 'test comment', 'user');
    expect(service.send).toHaveBeenCalled();
  });

  it('should disconnect', () => {
    service.disconnect();
    expect(service.connectionStatus$()).toBe('disconnected');
  });
});