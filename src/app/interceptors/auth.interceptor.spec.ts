import { TestBed } from '@angular/core/testing';
import { HttpRequest, HttpHandler } from '@angular/common/http';
import { authInterceptor } from './auth.interceptor';
import { AuthService } from '../auth.service';

describe('authInterceptor', () => {
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockHandler: jasmine.SpyObj<HttpHandler>;
  let mockRequest: HttpRequest<any>;

  beforeEach(() => {
    const authSpy = jasmine.createSpyObj('AuthService', [], { isAuthenticated$: jasmine.createSpy() });
    const handlerSpy = jasmine.createSpyObj('HttpHandler', ['handle']);

    TestBed.configureTestingModule({
      providers: [{ provide: AuthService, useValue: authSpy }]
    });

    mockAuthService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    mockHandler = handlerSpy;
    mockRequest = new HttpRequest('GET', '/test');
    
    spyOn(localStorage, 'getItem').and.returnValue('test-access-token');
  });

  it('should add auth header when authenticated', () => {
    (mockAuthService.isAuthenticated$ as jasmine.Spy).and.returnValue(true);
    (localStorage.getItem as jasmine.Spy).and.returnValue('test-access-token');
    
    TestBed.runInInjectionContext(() => authInterceptor(mockRequest, mockHandler.handle));
    
    expect(mockHandler.handle).toHaveBeenCalledWith(
      jasmine.objectContaining({
        headers: jasmine.objectContaining({
          lazyUpdate: jasmine.any(Array)
        })
      })
    );
  });

  it('should not add auth header when no token', () => {
    (mockAuthService.isAuthenticated$ as jasmine.Spy).and.returnValue(true);
    (localStorage.getItem as jasmine.Spy).and.returnValue(null);
    
    TestBed.runInInjectionContext(() => authInterceptor(mockRequest, mockHandler.handle));
    
    expect(mockHandler.handle).toHaveBeenCalledWith(mockRequest);
  });

  it('should not add auth header when not authenticated', () => {
    (mockAuthService.isAuthenticated$ as jasmine.Spy).and.returnValue(false);
    
    TestBed.runInInjectionContext(() => authInterceptor(mockRequest, mockHandler.handle));
    
    expect(mockHandler.handle).toHaveBeenCalledWith(mockRequest);
  });
});