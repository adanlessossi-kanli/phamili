import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class StorageService {
  setItem(key: string, value: any): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Storage error:', error);
    }
  }

  getItem<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Storage error:', error);
      return null;
    }
  }

  removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  clear(): void {
    localStorage.clear();
  }

  // Offline data persistence
  saveOfflineData(key: string, data: any): void {
    this.setItem(`offline_${key}`, { data, timestamp: Date.now() });
  }

  getOfflineData<T>(key: string, maxAge = 24 * 60 * 60 * 1000): T | null {
    const stored = this.getItem<{ data: T; timestamp: number }>(`offline_${key}`);
    
    if (!stored || Date.now() - stored.timestamp > maxAge) {
      return null;
    }
    
    return stored.data;
  }
}