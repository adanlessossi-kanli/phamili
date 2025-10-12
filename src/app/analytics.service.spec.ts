import { TestBed } from '@angular/core/testing';
import { AnalyticsService } from './analytics.service';

describe('AnalyticsService', () => {
  let service: AnalyticsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    (window as any).gtag = jasmine.createSpy('gtag');
    service = TestBed.inject(AnalyticsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should track event', () => {
    service.trackEvent('click', 'button', 'test', 1);
    expect((window as any).gtag).toHaveBeenCalled();
  });

  it('should track page view', () => {
    service.trackPageView('/test', 'Test Page');
    expect((window as any).gtag).toHaveBeenCalled();
  });

  it('should track user interaction', () => {
    service.trackUserInteraction('button', 'click');
    expect((window as any).gtag).toHaveBeenCalled();
  });

  it('should track performance', () => {
    service.trackPerformance('load_time', 1000);
    expect((window as any).gtag).toHaveBeenCalled();
  });

  it('should handle missing gtag gracefully', () => {
    delete (window as any).gtag;
    
    expect(() => {
      service.trackEvent('click', 'button');
      service.trackPageView('/test', 'Test Page');
      service.trackPerformance('metric', 100);
    }).not.toThrow();
  });

  it('should track events with all parameters', () => {
    service.trackEvent('purchase', 'product', 'shoes', 99.99);
    expect((window as any).gtag).toHaveBeenCalledWith('event', 'purchase', {
      event_category: 'product',
      event_label: 'shoes',
      value: 99.99
    });
  });

  it('should use fallback function when gtag is undefined', () => {
    delete (window as any).gtag;
    const service2 = new (service.constructor as any)();
    expect(() => service2.trackEvent('test', 'category')).not.toThrow();
  });
});