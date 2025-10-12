import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { NotificationService } from './notification.service';
import { CustomValidators } from './validators/custom.validators';
import { I18nService } from './i18n.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <h2>{{isLogin ? i18n.translate('auth.login') : i18n.translate('auth.register')}}</h2>
        <form [formGroup]="isLogin ? loginForm : registerForm" (ngSubmit)="onSubmit()">
          <div class="form-group" *ngIf="!isLogin">
            <input formControlName="name" [placeholder]="i18n.translate('auth.name')" required>
            <div *ngIf="registerForm.get('name')?.invalid && registerForm.get('name')?.touched" class="error">
              Name is required
            </div>
          </div>
          <div class="form-group">
            <input formControlName="email" type="email" [placeholder]="i18n.translate('auth.email')" required>
            <div *ngIf="isEmailInvalid" class="error">
              Valid email is required
            </div>
          </div>
          <div class="form-group">
            <input formControlName="password" type="password" [placeholder]="i18n.translate('auth.password')" required>
            <div *ngIf="isPasswordInvalid" class="error">
              <span *ngIf="!isLogin && registerForm.get('password')?.hasError('strongPassword')">Password must contain uppercase, lowercase, number and special character</span>
              <span *ngIf="isLogin">Password is required (min 6 characters)</span>
            </div>
          </div>
          <button type="submit" [disabled]="loading || isFormInvalid" class="auth-btn">
            {{loading ? i18n.translate('auth.processing') : (isLogin ? i18n.translate('auth.login') : i18n.translate('auth.register'))}}
          </button>
        </form>
        <p class="auth-switch">
          {{isLogin ? i18n.translate('auth.noAccount') : i18n.translate('auth.hasAccount')}}
          <a (click)="toggleMode()">{{isLogin ? i18n.translate('auth.register') : i18n.translate('auth.login')}}</a>
        </p>
        <div class="demo-info">
          <p><strong>Amazon Cognito Authentication</strong></p>
          <p>Create an account or use existing credentials</p>
          <p>Email verification may be required for new accounts</p>
        </div>
        <div class="confirmation-section" *ngIf="showConfirmation">
          <h3>{{i18n.translate('auth.confirmAccount')}}</h3>
          <input [(ngModel)]="confirmationCode" name="code" [placeholder]="i18n.translate('auth.verificationCode')" required>
          <button (click)="confirmAccount()" [disabled]="loading">{{i18n.translate('auth.confirm')}}</button>
        </div>
        <div class="forgot-password" *ngIf="isLogin">
          <a (click)="forgotPassword()">{{i18n.translate('auth.forgotPassword')}}</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-container { display: flex; justify-content: center; align-items: center; min-height: 80vh; padding: 20px; }
    .auth-card { background: white; padding: 40px; border-radius: 10px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); max-width: 400px; width: 100%; }
    .auth-card h2 { text-align: center; margin-bottom: 30px; color: #2c3e50; }
    .form-group { margin-bottom: 20px; }
    .form-group input { width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 16px; }
    .auth-btn { width: 100%; padding: 12px; background: #2c3e50; color: white; border: none; border-radius: 6px; font-size: 16px; cursor: pointer; transition: background 0.3s; }
    .auth-btn:hover:not(:disabled) { background: #34495e; }
    .auth-btn:disabled { opacity: 0.6; cursor: not-allowed; }
    .auth-switch { text-align: center; margin-top: 20px; }
    .auth-switch a { color: #2c3e50; cursor: pointer; text-decoration: underline; }
    .demo-info { background: #f8f9fa; padding: 15px; border-radius: 6px; margin-top: 20px; font-size: 14px; }
    .demo-info p { margin: 5px 0; }
    .error { color: #dc3545; font-size: 12px; margin-top: 5px; }
    .confirmation-section { background: #e3f2fd; padding: 20px; border-radius: 6px; margin-top: 20px; }
    .confirmation-section h3 { margin-top: 0; color: #1976d2; }
    .confirmation-section input { width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 4px; margin-bottom: 15px; }
    .confirmation-section button { width: 100%; padding: 12px; background: #1976d2; color: white; border: none; border-radius: 4px; cursor: pointer; }
    .forgot-password { text-align: center; margin-top: 15px; }
    .forgot-password a { color: #2c3e50; cursor: pointer; text-decoration: underline; font-size: 14px; }
  `]
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private notificationService = inject(NotificationService);
  private fb = inject(FormBuilder);
  protected i18n = inject(I18nService);

  isLogin = true;
  loading = false;
  showConfirmation = false;
  confirmationCode = '';
  
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });
  
  registerForm = this.fb.group({
    name: ['', [Validators.required, CustomValidators.noWhitespace()]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, CustomValidators.strongPassword()]]
  });

  async onSubmit() {
    this.loading = true;
    try {
      if (this.isLogin) {
        const form = this.loginForm.value;
        const success = await this.authService.login(form.email!, form.password!);
        if (success) {
          this.notificationService.success(this.i18n.translate('auth.loginSuccess'));
          this.router.navigate(['/home']);
        } else {
          this.notificationService.error(this.i18n.translate('auth.loginError'));
        }
      } else {
        const form = this.registerForm.value;
        const needsConfirmation = await this.authService.register(form.name!, form.email!, form.password!);
        if (needsConfirmation) {
          this.notificationService.info(this.i18n.translate('auth.registerSuccess'));
          this.showConfirmation = true;
        } else {
          this.notificationService.error('Registration failed');
        }
      }
    } catch (error) {
      this.notificationService.error(this.i18n.translate('error.generic'));
    } finally {
      this.loading = false;
    }
  }

  toggleMode() {
    this.isLogin = !this.isLogin;
    this.showConfirmation = false;
    this.loginForm.reset();
    this.registerForm.reset();
    this.confirmationCode = '';
  }

  async confirmAccount() {
    const email = this.registerForm.get('email')?.value;
    if (!this.confirmationCode || !email) return;
    
    this.loading = true;
    try {
      const success = await this.authService.confirmRegistration(email, this.confirmationCode);
      if (success) {
        this.notificationService.success('Account confirmed! You can now login.');
        this.showConfirmation = false;
        this.isLogin = true;
      } else {
        this.notificationService.error('Invalid confirmation code');
      }
    } catch (error) {
      this.notificationService.error('Confirmation failed');
    } finally {
      this.loading = false;
    }
  }

  get isEmailInvalid() {
    if (this.isLogin) {
      const emailControl = this.loginForm.get('email');
      return emailControl?.invalid && emailControl?.touched;
    } else {
      const emailControl = this.registerForm.get('email');
      return emailControl?.invalid && emailControl?.touched;
    }
  }

  get isPasswordInvalid() {
    if (this.isLogin) {
      const passwordControl = this.loginForm.get('password');
      return passwordControl?.invalid && passwordControl?.touched;
    } else {
      const passwordControl = this.registerForm.get('password');
      return passwordControl?.invalid && passwordControl?.touched;
    }
  }

  get isFormInvalid() {
    return this.isLogin ? this.loginForm.invalid : this.registerForm.invalid;
  }

  async forgotPassword() {
    const email = this.loginForm.get('email')?.value;
    if (!email) {
      this.notificationService.error('Please enter your email address');
      return;
    }

    this.loading = true;
    try {
      const success = await this.authService.forgotPassword(email);
      if (success) {
        this.notificationService.success('Password reset instructions sent to your email');
      } else {
        this.notificationService.error('Failed to send reset instructions');
      }
    } catch (error) {
      this.notificationService.error('Password reset failed');
    } finally {
      this.loading = false;
    }
  }
}