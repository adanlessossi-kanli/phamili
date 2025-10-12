import { TestBed } from '@angular/core/testing';
import { SecurityService } from './security.service';

describe('SecurityService', () => {
  let service: SecurityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SecurityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should sanitize input', () => {
    const maliciousInput = '<script>alert("xss")</script>test';
    const sanitized = service.sanitizeInput(maliciousInput);
    expect(sanitized).toBe('scriptalert("xss")/scripttest');
  });

  it('should check rate limit', () => {
    expect(service.checkRateLimit('test-key', 2)).toBe(true);
    expect(service.checkRateLimit('test-key', 2)).toBe(true);
    expect(service.checkRateLimit('test-key', 2)).toBe(false);
  });

  it('should generate CSRF token', () => {
    const token1 = service.generateCSRFToken();
    const token2 = service.generateCSRFToken();
    
    expect(token1).toBeTruthy();
    expect(token2).toBeTruthy();
    expect(token1).not.toBe(token2);
  });
});