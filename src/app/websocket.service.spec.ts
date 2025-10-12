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

  it('should disconnect when socket exists', () => {
    const mockWebSocket = jasmine.createSpyObj('WebSocket', ['send', 'close']);
    service['socket'] = mockWebSocket;
    
    service.disconnect();
    
    expect(mockWebSocket.close).toHaveBeenCalled();
    expect(service['socket']).toBeNull();
  });

  it('should handle disconnect when no socket exists', () => {
    service['socket'] = null;
    
    service.disconnect();
    
    expect(service['socket']).toBeNull();
  });

  it('should connect to websocket with default URL', () => {
    const mockWebSocket = jasmine.createSpyObj('WebSocket', ['send', 'close']);
    spyOn(window, 'WebSocket').and.returnValue(mockWebSocket);
    
    service.connect();
    
    expect(window.WebSocket).toHaveBeenCalledWith('ws://localhost:8080');
  });

  it('should connect to websocket with custom URL', () => {
    const mockWebSocket = jasmine.createSpyObj('WebSocket', ['send', 'close']);
    spyOn(window, 'WebSocket').and.returnValue(mockWebSocket);
    
    service.connect('ws://custom:9000');
    
    expect(window.WebSocket).toHaveBeenCalledWith('ws://custom:9000');
  });

  it('should handle connection events', () => {
    const mockWebSocket = jasmine.createSpyObj('WebSocket', ['send', 'close']);
    spyOn(window, 'WebSocket').and.returnValue(mockWebSocket);
    
    service.connect('ws://localhost:8080');
    
    // Simulate connection open
    mockWebSocket.onopen?.(new Event('open'));
    expect(service.connectionStatus$()).toBe('connected');
    
    // Simulate connection close
    mockWebSocket.onclose?.(new CloseEvent('close'));
    expect(service.connectionStatus$()).toBe('disconnected');
  });

  it('should handle websocket errors', () => {
    const mockWebSocket = jasmine.createSpyObj('WebSocket', ['send', 'close']);
    spyOn(window, 'WebSocket').and.returnValue(mockWebSocket);
    spyOn(console, 'error');
    
    service.connect('ws://localhost:8080');
    mockWebSocket.onerror?.(new Event('error'));
    
    expect(console.error).toHaveBeenCalled();
  });

  it('should handle incoming messages', () => {
    const mockWebSocket = jasmine.createSpyObj('WebSocket', ['send', 'close']);
    spyOn(window, 'WebSocket').and.returnValue(mockWebSocket);
    
    service.connect('ws://localhost:8080');
    const messageEvent = new MessageEvent('message', { data: JSON.stringify({ type: 'test', data: 'message' }) });
    mockWebSocket.onmessage?.(messageEvent);
    
    service.messages$.subscribe(message => {
      expect(message).toEqual({ type: 'test', data: 'message' });
    });
    
    expect(mockWebSocket.onmessage).toBeDefined();
  });

  it('should send message when connected', () => {
    const mockWebSocket = jasmine.createSpyObj('WebSocket', ['send', 'close'], {
      readyState: WebSocket.OPEN
    });
    service['socket'] = mockWebSocket;
    
    service.send({ type: 'test', data: 'message' });
    
    expect(mockWebSocket.send).toHaveBeenCalledWith(JSON.stringify({ type: 'test', data: 'message' }));
  });

  it('should not send when disconnected', () => {
    const mockWebSocket = jasmine.createSpyObj('WebSocket', ['send', 'close'], {
      readyState: WebSocket.CLOSED
    });
    service['socket'] = mockWebSocket;
    
    service.send({ type: 'test', data: 'message' });
    
    expect(mockWebSocket.send).not.toHaveBeenCalled();
  });

  it('should handle auto-reconnection after close', () => {
    jasmine.clock().install();
    const mockWebSocket = jasmine.createSpyObj('WebSocket', ['send', 'close']);
    spyOn(window, 'WebSocket').and.returnValue(mockWebSocket);
    spyOn(service, 'connect').and.callThrough();
    
    service.connect('ws://test:8080');
    
    // Simulate connection close which triggers auto-reconnect
    mockWebSocket.onclose?.(new CloseEvent('close'));
    
    expect(service.connectionStatus$()).toBe('disconnected');
    
    // Fast-forward time by 5 seconds to trigger reconnect
    jasmine.clock().tick(5001);
    
    expect(service.connect).toHaveBeenCalledTimes(2);
    jasmine.clock().uninstall();
  });

  it('should not connect if already open', () => {
    const mockWebSocket = jasmine.createSpyObj('WebSocket', ['send', 'close'], {
      readyState: WebSocket.OPEN
    });
    service['socket'] = mockWebSocket;
    spyOn(window, 'WebSocket');
    
    service.connect('ws://localhost:8080');
    
    expect(window.WebSocket).not.toHaveBeenCalled();
  });

  it('should handle message parsing error', () => {
    const mockWebSocket = jasmine.createSpyObj('WebSocket', ['send', 'close']);
    spyOn(window, 'WebSocket').and.returnValue(mockWebSocket);
    spyOn(console, 'error');
    
    service.connect('ws://localhost:8080');
    
    const invalidMessageEvent = new MessageEvent('message', { data: 'invalid json' });
    mockWebSocket.onmessage?.(invalidMessageEvent);
    
    expect(console.error).toHaveBeenCalled();
  });
});