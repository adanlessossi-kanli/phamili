import { Injectable } from '@angular/core';
import { AnalyticsService } from './analytics.service';

@Injectable({
  providedIn: 'root'
})
export class PerformanceService {
  constructor(private analytics: AnalyticsService) {
    this.initWebVitals();
  }

  measurePageLoad() {
    if (typeof window !== 'undefined' && 'performance' in window) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
          const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
          const domContentLoaded = perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart;
          const firstContentfulPaint = this.getFirstContentfulPaint();
          
          this.analytics.trackPerformance('page_load_time', loadTime);
          this.analytics.trackPerformance('dom_content_loaded', domContentLoaded);
          if (firstContentfulPaint) {
            this.analytics.trackPerformance('first_contentful_paint', firstContentfulPaint);
          }
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

  private initWebVitals() {
    // Track Largest Contentful Paint
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.analytics.trackPerformance('largest_contentful_paint', lastEntry.startTime);
      });
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    }
  }

  private getFirstContentfulPaint(): number | null {
    const paintEntries = performance.getEntriesByType('paint');
    const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint');
    return fcpEntry ? fcpEntry.startTime : null;
  }

  trackMemoryUsage() {
    if ('memory' in performance && (performance as any).memory) {
      const memory = (performance as any).memory;
      if (memory.usedJSHeapSize !== undefined && memory.totalJSHeapSize !== undefined) {
        this.analytics.trackPerformance('memory_used', memory.usedJSHeapSize);
        this.analytics.trackPerformance('memory_total', memory.totalJSHeapSize);
      }
    }
  }
}