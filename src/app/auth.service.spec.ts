import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
    
    spyOn(localStorage, 'getItem').and.returnValue(null);
    spyOn(localStorage, 'setItem');
    spyOn(localStorage, 'removeItem');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should handle login process', () => {
    expect(service.login).toBeDefined();
    expect(typeof service.login).toBe('function');
  });

  it('should handle registration process', () => {
    expect(service.register).toBeDefined();
    expect(typeof service.register).toBe('function');
  });

  it('should logout user', async () => {
    await service.logout();
    expect(localStorage.removeItem).toHaveBeenCalledWith('accessToken');
    expect(service.isAuthenticated$()).toBe(false);
    expect(service.user$()).toBeNull();
  });

  it('should check auth from localStorage', async () => {
    (localStorage.getItem as jasmine.Spy).and.returnValue('test-token');
    
    await service.checkAuth();
    
    expect(localStorage.getItem).toHaveBeenCalledWith('accessToken');
  });

  it('should handle login success', async () => {
    spyOn(service['cognitoClient'], 'send').and.returnValue(Promise.resolve({
      AuthenticationResult: { AccessToken: 'test-token' }
    }) as any);
    
    const result = await service.login('test@test.com', 'password');
    
    expect(result).toBe(true);
    expect(localStorage.setItem).toHaveBeenCalledWith('accessToken', 'test-token');
  });

  it('should handle login failure', async () => {
    spyOn(service['cognitoClient'], 'send').and.returnValue(Promise.resolve({}) as any);
    
    const result = await service.login('test@test.com', 'password');
    
    expect(result).toBe(false);
  });

  it('should handle register success', async () => {
    spyOn(service['cognitoClient'], 'send').and.returnValue(Promise.resolve({}) as any);
    
    const result = await service.register('Test', 'test@test.com', 'password');
    
    expect(result).toBe(true);
  });

  it('should handle register failure', async () => {
    spyOn(service['cognitoClient'], 'send').and.throwError('Error');
    
    const result = await service.register('Test', 'test@test.com', 'password');
    
    expect(result).toBe(false);
  });

  it('should handle confirm registration success', async () => {
    spyOn(service['cognitoClient'], 'send').and.returnValue(Promise.resolve({}) as any);
    
    const result = await service.confirmRegistration('test@test.com', '123456');
    
    expect(result).toBe(true);
  });

  it('should handle forgot password success', async () => {
    spyOn(service['cognitoClient'], 'send').and.returnValue(Promise.resolve({}) as any);
    
    const result = await service.forgotPassword('test@test.com');
    
    expect(result).toBe(true);
  });

  it('should have confirmation method', () => {
    expect(service.confirmRegistration).toBeDefined();
    expect(typeof service.confirmRegistration).toBe('function');
  });

  it('should have forgot password method', () => {
    expect(service.forgotPassword).toBeDefined();
    expect(typeof service.forgotPassword).toBe('function');
  });

  it('should handle updateUserState success', async () => {
    const mockResponse = {
      Username: 'testuser',
      UserAttributes: [
        { Name: 'name', Value: 'Test User' },
        { Name: 'email', Value: 'test@test.com' }
      ]
    };
    
    service['accessToken'] = 'test-token';
    spyOn(service['cognitoClient'], 'send').and.returnValue(Promise.resolve(mockResponse) as any);
    
    await service['updateUserState']();
    
    expect(service.isAuthenticated$()).toBe(true);
  });

  it('should handle updateUserState failure', async () => {
    service['accessToken'] = 'invalid-token';
    spyOn(service['cognitoClient'], 'send').and.throwError('Invalid token');
    spyOn(service, 'logout');
    
    await service['updateUserState']();
    
    expect(service.logout).toHaveBeenCalled();
  });

  it('should handle login error', async () => {
    spyOn(service['cognitoClient'], 'send').and.throwError('Network error');
    spyOn(console, 'error');
    
    const result = await service.login('test@test.com', 'password');
    
    expect(result).toBe(false);
    expect(console.error).toHaveBeenCalledWith('Login failed:', jasmine.any(Error));
  });

  it('should handle confirmRegistration error', async () => {
    spyOn(service['cognitoClient'], 'send').and.throwError('Invalid code');
    spyOn(console, 'error');
    
    const result = await service.confirmRegistration('test@test.com', '123456');
    
    expect(result).toBe(false);
    expect(console.error).toHaveBeenCalledWith('Confirmation failed:', jasmine.any(Error));
  });

  it('should handle forgotPassword error', async () => {
    spyOn(service['cognitoClient'], 'send').and.throwError('User not found');
    spyOn(console, 'error');
    
    const result = await service.forgotPassword('test@test.com');
    
    expect(result).toBe(false);
    expect(console.error).toHaveBeenCalledWith('Forgot password failed:', jasmine.any(Error));
  });

  it('should handle checkAuth error and reset user state', async () => {
    (localStorage.getItem as jasmine.Spy).and.returnValue('invalid-token');
    spyOn(service['cognitoClient'], 'send').and.throwError('Invalid token');
    
    // Set initial state to verify it gets reset
    service['currentUser'].set({ id: '1', name: 'Test', email: 'test@test.com' });
    service['isAuthenticated'].set(true);
    
    await service.checkAuth();
    
    expect(service.isAuthenticated$()).toBe(false);
    expect(service.user$()).toBeNull();
  });

  it('should handle updateUserState with no access token', async () => {
    service['accessToken'] = null;
    
    await service['updateUserState']();
    
    // Should return early without making any calls
    expect(service.isAuthenticated$()).toBe(false);
  });
});