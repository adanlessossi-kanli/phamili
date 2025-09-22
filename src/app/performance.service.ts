import { Injectable } from '@angular/core';
import { AnalyticsService } from './analytics.service';

@Injectable({
  providedIn: 'root'
})
export class PerformanceService {
  constructor(private analytics: AnalyticsService) {}

  measurePageLoad() {
    if (typeof window !== 'undefined' && 'performance' in window) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
          const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
          const domContentLoaded = perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart;
          
          this.analytics.trackPerformance('page_load_time', loadTime);
          this.analytics.trackPerformance('dom_content_loaded', domContentLoaded);
        }, 0);
      });
    }
  }

  measureComponentRender(componentName: string, startTime: number) {
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    this.analytics.trackPerformance(`${componentName}_render_time`, renderTime);
  }

  measureApiCall(endpoint: string, startTime: number) {
    const endTime = performance.now();
    const apiTime = endTime - startTime;
    this.analytics.trackPerformance(`api_${endpoint}_time`, apiTime);
  }
}