import { Injectable } from '@angular/core';

declare global {
  interface Window {
    gtag: any;
  }
}

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private gtag: any;

  constructor() {
    this.gtag = window.gtag || function() {};
  }

  trackEvent(action: string, category: string, label?: string, value?: number) {
    this.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value
    });
  }

  trackPageView(url: string, title: string) {
    this.gtag('config', 'GA_MEASUREMENT_ID', {
      page_path: url,
      page_title: title
    });
  }

  trackUserInteraction(element: string, action: string) {
    this.trackEvent(action, 'User Interaction', element);
  }

  trackPerformance(metric: string, value: number) {
    this.trackEvent('performance', 'Performance', metric, value);
  }
}