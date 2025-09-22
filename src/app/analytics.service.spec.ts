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
});