import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginComponent } from './login.component';
import { AuthService } from './auth.service';
import { NotificationService } from './notification.service';
import { I18nService } from './i18n.service';
import { TestHelpers } from './testing/test-helpers';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;
  let notificationService: jasmine.SpyObj<NotificationService>;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['login', 'register', 'confirmRegistration', 'forgotPassword']);
    const routerSpy = TestHelpers.createMockRouter();
    const notificationSpy = TestHelpers.createMockNotificationService();
    const i18nSpy = jasmine.createSpyObj('I18nService', ['translate']);
    i18nSpy.translate.and.callFake((key: string) => {
      const translations: { [key: string]: string } = {
        'auth.login': 'Login',
        'auth.register': 'Register',
        'auth.name': 'Full Name',
        'auth.email': 'Email',
        'auth.password': 'Password',
        'auth.processing': 'Processing...',
        'auth.noAccount': 'Don\'t have an account?',
        'auth.hasAccount': 'Already have an account?',
        'auth.confirmAccount': 'Confirm Your Account',
        'auth.verificationCode': 'Verification Code',
        'auth.confirm': 'Confirm',
        'auth.forgotPassword': 'Forgot Password?',
        'auth.loginSuccess': 'Login successful!',
        'auth.loginError': 'Invalid credentials',
        'auth.registerSuccess': 'Registration successful! Please check your email.',
        'error.generic': 'An error occurred. Please try again.'
      };
      return translations[key] || key;
    });

    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule, FormsModule],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpy },
        { provide: NotificationService, useValue: notificationSpy },
        { provide: I18nService, useValue: i18nSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    notificationService = TestBed.inject(NotificationService) as jasmine.SpyObj<NotificationService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize forms with validators', () => {
    expect(component.loginForm).toBeDefined();
    expect(component.registerForm).toBeDefined();
    
    component.loginForm.patchValue({ email: '', password: '' });
    expect(component.loginForm.invalid).toBe(true);
    
    component.loginForm.patchValue({ email: 'test@test.com', password: '123456' });
    expect(component.loginForm.valid).toBe(true);
  });

  it('should validate strong password in register form', () => {
    component.registerForm.patchValue({
      name: 'Test User',
      email: 'test@test.com',
      password: 'weak'
    });
    expect(component.registerForm.get('password')?.hasError('strongPassword')).toBe(true);
    
    component.registerForm.patchValue({ password: 'Strong123!@#' });
    expect(component.registerForm.get('password')?.hasError('strongPassword')).toBe(false);
  });

  it('should validate no whitespace in name field', () => {
    component.registerForm.patchValue({
      name: '   ',
      email: 'test@test.com',
      password: 'Strong123!@#'
    });
    expect(component.registerForm.get('name')?.hasError('whitespace')).toBe(true);
    
    component.registerForm.patchValue({ name: 'Valid Name' });
    expect(component.registerForm.get('name')?.hasError('whitespace')).toBe(false);
  });

  it('should toggle between login and register', () => {
    expect(component.isLogin).toBe(true);
    component.toggleMode();
    expect(component.isLogin).toBe(false);
  });

  it('should handle confirmation flow', async () => {
    authService.confirmRegistration.and.returnValue(Promise.resolve(true));
    component.confirmationCode = '123456';
    component.registerForm.patchValue({ email: 'test@test.com' });
    
    await component.confirmAccount();
    
    expect(authService.confirmRegistration).toHaveBeenCalledWith('test@test.com', '123456');
    expect(notificationService.success).toHaveBeenCalled();
  });

  it('should handle forgot password', async () => {
    authService.forgotPassword.and.returnValue(Promise.resolve(true));
    component.loginForm.patchValue({ email: 'test@test.com' });
    
    await component.forgotPassword();
    
    expect(authService.forgotPassword).toHaveBeenCalledWith('test@test.com');
    expect(notificationService.success).toHaveBeenCalled();
  });

  it('should handle forgot password without email', async () => {
    component.loginForm.patchValue({ email: '' });
    
    await component.forgotPassword();
    
    expect(notificationService.error).toHaveBeenCalledWith('Please enter your email address');
  });

  it('should handle successful registration', async () => {
    authService.register.and.returnValue(Promise.resolve(true));
    component.isLogin = false;
    component.registerForm.patchValue({
      name: 'Test User',
      email: 'test@test.com',
      password: 'Strong123!@#'
    });
    
    await component.onSubmit();
    
    expect(authService.register).toHaveBeenCalledWith('Test User', 'test@test.com', 'Strong123!@#');
    expect(notificationService.info).toHaveBeenCalled();
  });

  it('should handle failed registration', async () => {
    authService.register.and.returnValue(Promise.resolve(false));
    component.isLogin = false;
    component.registerForm.patchValue({
      name: 'Test User',
      email: 'test@test.com',
      password: 'Strong123!@#'
    });
    
    await component.onSubmit();
    
    expect(notificationService.error).toHaveBeenCalled();
  });

  it('should handle confirmation failure', async () => {
    authService.confirmRegistration.and.returnValue(Promise.resolve(false));
    component.confirmationCode = '123456';
    component.registerForm.patchValue({ email: 'test@test.com' });
    
    await component.confirmAccount();
    
    expect(notificationService.error).toHaveBeenCalledWith('Invalid confirmation code');
  });

  it('should handle forgot password failure', async () => {
    authService.forgotPassword.and.returnValue(Promise.resolve(false));
    component.loginForm.patchValue({ email: 'test@test.com' });
    
    await component.forgotPassword();
    
    expect(notificationService.error).toHaveBeenCalledWith('Failed to send reset instructions');
  });

  it('should handle errors during submission', async () => {
    authService.login.and.throwError('Network error');
    component.loginForm.patchValue({ email: 'test@test.com', password: 'password' });
    
    await component.onSubmit();
    
    expect(notificationService.error).toHaveBeenCalledWith('An error occurred. Please try again.');
  });

  it('should handle successful login', async () => {
    authService.login.and.returnValue(Promise.resolve(true));
    component.loginForm.patchValue({ email: 'test@test.com', password: 'password' });
    
    await component.onSubmit();
    
    expect(router.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('should handle failed login', async () => {
    authService.login.and.returnValue(Promise.resolve(false));
    component.loginForm.patchValue({ email: 'test@test.com', password: 'password' });
    
    await component.onSubmit();
    
    expect(notificationService.error).toHaveBeenCalledWith('Invalid credentials');
  });

  it('should use i18n translations', () => {
    const i18nService = TestBed.inject(I18nService) as jasmine.SpyObj<I18nService>;
    fixture.detectChanges();
    expect(i18nService.translate).toHaveBeenCalledWith('auth.login');
  });

  it('should validate email and password fields', () => {
    expect(component.isEmailInvalid).toBeFalsy();
    expect(component.isPasswordInvalid).toBeFalsy();
    
    // Mark fields as touched to trigger validation display
    component.loginForm.get('email')?.markAsTouched();
    component.loginForm.get('password')?.markAsTouched();
    
    expect(component.isEmailInvalid).toBeTruthy();
    expect(component.isPasswordInvalid).toBeTruthy();
  });

  it('should check form validity', () => {
    expect(component.isFormInvalid).toBeTruthy();
    
    component.loginForm.patchValue({ email: 'test@test.com', password: 'password' });
    expect(component.isFormInvalid).toBeFalsy();
  });

  it('should reset forms when toggling mode', () => {
    component.loginForm.patchValue({ email: 'test@test.com', password: 'password' });
    component.registerForm.patchValue({ name: 'Test', email: 'test@test.com', password: 'Strong123!' });
    component.confirmationCode = '123456';
    component.showConfirmation = true;
    
    component.toggleMode();
    
    expect(component.loginForm.get('email')?.value).toBeNull();
    expect(component.registerForm.get('name')?.value).toBeNull();
    expect(component.confirmationCode).toBe('');
    expect(component.showConfirmation).toBeFalsy();
  });

  it('should handle confirmation without code or email', async () => {
    component.confirmationCode = '';
    component.registerForm.patchValue({ email: '' });
    
    await component.confirmAccount();
    
    expect(authService.confirmRegistration).not.toHaveBeenCalled();
  });

  it('should handle confirmation errors', async () => {
    authService.confirmRegistration.and.throwError('Network error');
    component.confirmationCode = '123456';
    component.registerForm.patchValue({ email: 'test@test.com' });
    
    await component.confirmAccount();
    
    expect(notificationService.error).toHaveBeenCalledWith('Confirmation failed');
  });

  it('should handle forgot password errors', async () => {
    authService.forgotPassword.and.throwError('Network error');
    component.loginForm.patchValue({ email: 'test@test.com' });
    
    await component.forgotPassword();
    
    expect(notificationService.error).toHaveBeenCalledWith('Password reset failed');
  });

  it('should render form elements correctly', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('form')).toBeTruthy();
    expect(compiled.querySelector('input[type="email"]')).toBeTruthy();
    expect(compiled.querySelector('input[type="password"]')).toBeTruthy();
    expect(compiled.querySelector('button[type="submit"]')).toBeTruthy();
  });

  it('should show register form when not in login mode', () => {
    component.isLogin = false;
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement;
    const nameInput = compiled.querySelector('input[formControlName="name"]');
    expect(nameInput).toBeTruthy();
  });

  it('should show confirmation section when needed', () => {
    component.showConfirmation = true;
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement;
    const confirmationSection = compiled.querySelector('.confirmation-section');
    expect(confirmationSection).toBeTruthy();
  });

  it('should show forgot password link in login mode', () => {
    component.isLogin = true;
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement;
    const forgotPasswordLink = compiled.querySelector('.forgot-password');
    expect(forgotPasswordLink).toBeTruthy();
  });
});