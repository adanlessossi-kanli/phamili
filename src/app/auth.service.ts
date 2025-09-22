import { Injectable, signal } from '@angular/core';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser = signal<User | null>(null);
  private isAuthenticated = signal(false);

  user$ = this.currentUser.asReadonly();
  isAuthenticated$ = this.isAuthenticated.asReadonly();

  login(email: string, password: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (email === 'demo@phamili.com' && password === 'demo123') {
          const user: User = {
            id: '1',
            name: 'Demo User',
            email: 'demo@phamili.com',
            avatar: '👤'
          };
          this.currentUser.set(user);
          this.isAuthenticated.set(true);
          localStorage.setItem('phamili_user', JSON.stringify(user));
          resolve(true);
        } else {
          resolve(false);
        }
      }, 1000);
    });
  }

  logout() {
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    localStorage.removeItem('phamili_user');
  }

  checkAuth() {
    const stored = localStorage.getItem('phamili_user');
    if (stored) {
      const user = JSON.parse(stored);
      this.currentUser.set(user);
      this.isAuthenticated.set(true);
    }
  }

  register(name: string, email: string, password: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user: User = {
          id: Date.now().toString(),
          name,
          email,
          avatar: '👤'
        };
        this.currentUser.set(user);
        this.isAuthenticated.set(true);
        localStorage.setItem('phamili_user', JSON.stringify(user));
        resolve(true);
      }, 1000);
    });
  }
}