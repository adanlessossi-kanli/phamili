import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login with valid credentials', async () => {
    const result = await service.login('demo@phamili.com', 'demo123');
    expect(result).toBe(true);
    expect(service.isAuthenticated$()).toBe(true);
    expect(service.user$()?.email).toBe('demo@phamili.com');
  });

  it('should fail login with invalid credentials', async () => {
    const result = await service.login('wrong@email.com', 'wrong');
    expect(result).toBe(false);
    expect(service.isAuthenticated$()).toBe(false);
  });

  it('should logout user', () => {
    service.login('demo@phamili.com', 'demo123');
    service.logout();
    expect(service.isAuthenticated$()).toBe(false);
    expect(service.user$()).toBeNull();
  });

  it('should register new user', async () => {
    const result = await service.register('Test User', 'test@test.com', 'password');
    expect(result).toBe(true);
    expect(service.isAuthenticated$()).toBe(true);
  });

  it('should check auth from localStorage', () => {
    const user = { id: '1', name: 'Test', email: 'test@test.com' };
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(user));
    service.checkAuth();
    expect(service.isAuthenticated$()).toBe(true);
    expect(service.user$()?.email).toBe('test@test.com');
  });
});