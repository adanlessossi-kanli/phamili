import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { NotificationService } from './notification.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <h2>{{isLogin ? 'Login' : 'Register'}}</h2>
        <form (ngSubmit)="onSubmit()" #form="ngForm">
          <div class="form-group" *ngIf="!isLogin">
            <input [(ngModel)]="formData.name" name="name" placeholder="Full Name" required>
          </div>
          <div class="form-group">
            <input [(ngModel)]="formData.email" name="email" type="email" placeholder="Email" required>
          </div>
          <div class="form-group">
            <input [(ngModel)]="formData.password" name="password" type="password" placeholder="Password" required>
          </div>
          <button type="submit" [disabled]="loading || form.invalid" class="auth-btn">
            {{loading ? 'Processing...' : (isLogin ? 'Login' : 'Register')}}
          </button>
        </form>
        <p class="auth-switch">
          {{isLogin ? "Don't have an account?" : "Already have an account?"}}
          <a (click)="toggleMode()">{{isLogin ? 'Register' : 'Login'}}</a>
        </p>
        <div class="demo-info">
          <p><strong>Demo Credentials:</strong></p>
          <p>Email: demo@phamili.com</p>
          <p>Password: demo123</p>
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
  `]
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private notificationService = inject(NotificationService);

  isLogin = true;
  loading = false;
  formData = { name: '', email: '', password: '' };

  async onSubmit() {
    this.loading = true;
    try {
      const success = this.isLogin 
        ? await this.authService.login(this.formData.email, this.formData.password)
        : await this.authService.register(this.formData.name, this.formData.email, this.formData.password);

      if (success) {
        this.notificationService.success(this.isLogin ? 'Login successful!' : 'Registration successful!');
        this.router.navigate(['/home']);
      } else {
        this.notificationService.error('Invalid credentials. Try demo@phamili.com / demo123');
      }
    } catch (error) {
      this.notificationService.error('An error occurred. Please try again.');
    } finally {
      this.loading = false;
    }
  }

  toggleMode() {
    this.isLogin = !this.isLogin;
    this.formData = { name: '', email: '', password: '' };
  }
}