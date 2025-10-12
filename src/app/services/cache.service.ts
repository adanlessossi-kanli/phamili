import { Injectable } from '@angular/core';
import { Observable, of, shareReplay } from 'rxjs';

interface CacheEntry<T> {
  data: Observable<T>;
  timestamp: number;
}

@Injectable({ providedIn: 'root' })
export class CacheService {
  private cache = new Map<string, CacheEntry<any>>();
  private readonly TTL = 5 * 60 * 1000; // 5 minutes

  get<T>(key: string, factory: () => Observable<T>): Observable<T> {
    const entry = this.cache.get(key);
    
    if (entry && Date.now() - entry.timestamp < this.TTL) {
      return entry.data;
    }

    const data = factory().pipe(shareReplay(1));
    this.cache.set(key, { data, timestamp: Date.now() });
    return data;
  }

  invalidate(key: string) {
    this.cache.delete(key);
  }

  clear() {
    this.cache.clear();
  }
}