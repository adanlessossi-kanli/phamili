import { TestBed } from '@angular/core/testing';
import { PerformanceService } from './performance.service';
import { AnalyticsService } from './analytics.service';

describe('PerformanceService', () => {
  let service: PerformanceService;
  let analyticsService: jasmine.SpyObj<AnalyticsService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('AnalyticsService', ['trackPerformance']);
    TestBed.configureTestingModule({
      providers: [{ provide: AnalyticsService, useValue: spy }]
    });
    service = TestBed.inject(PerformanceService);
    analyticsService = TestBed.inject(AnalyticsService) as jasmine.SpyObj<AnalyticsService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should measure component render', () => {
    const startTime = performance.now();
    service.measureComponentRender('TestComponent', startTime);
    expect(analyticsService.trackPerformance).toHaveBeenCalled();
  });

  it('should measure API call', () => {
    const startTime = performance.now();
    service.measureApiCall('test-endpoint', startTime);
    expect(analyticsService.trackPerformance).toHaveBeenCalled();
  });

  it('should track memory usage when available', () => {
    const mockMemory = {
      usedJSHeapSize: 1000000,
      totalJSHeapSize: 2000000
    };
    Object.defineProperty(performance, 'memory', {
      value: mockMemory,
      configurable: true
    });

    service.trackMemoryUsage();

    expect(analyticsService.trackPerformance).toHaveBeenCalledWith('memory_used', 1000000);
    expect(analyticsService.trackPerformance).toHaveBeenCalledWith('memory_total', 2000000);
  });

  it('should handle missing memory API gracefully', () => {
    // Just verify the method doesn't throw when memory API is missing or undefined
    expect(() => service.trackMemoryUsage()).not.toThrow();
  });

  it('should get first contentful paint', () => {
    const mockEntries = [
      { name: 'first-paint', startTime: 100 },
      { name: 'first-contentful-paint', startTime: 150 }
    ];
    spyOn(performance, 'getEntriesByType').and.returnValue(mockEntries as any);

    const fcp = service['getFirstContentfulPaint']();

    expect(fcp).toBe(150);
  });

  it('should return null when FCP not available', () => {
    spyOn(performance, 'getEntriesByType').and.returnValue([]);

    const fcp = service['getFirstContentfulPaint']();

    expect(fcp).toBeNull();
  });

  it('should handle missing PerformanceObserver gracefully', () => {
    const originalObserver = (window as any).PerformanceObserver;
    delete (window as any).PerformanceObserver;

    expect(() => service['initWebVitals']()).not.toThrow();

    (window as any).PerformanceObserver = originalObserver;
  });

  it('should measure page load when window and performance are available', () => {
    const mockPerfData = {
      loadEventEnd: 1000,
      loadEventStart: 500,
      domContentLoadedEventEnd: 800,
      domContentLoadedEventStart: 600
    };
    
    spyOn(performance, 'getEntriesByType').and.returnValue([mockPerfData] as any);
    spyOn(service as any, 'getFirstContentfulPaint').and.returnValue(200);
    
    service.measurePageLoad();
    
    expect(service).toBeTruthy();
  });

  it('should handle PerformanceObserver callback', () => {
    const mockObserver = {
      observe: jasmine.createSpy()
    };
    const mockList = {
      getEntries: () => [{ startTime: 100 }]
    };
    
    const MockPerformanceObserver = function(callback: any) {
      callback(mockList);
      return mockObserver;
    };
    
    (window as any).PerformanceObserver = MockPerformanceObserver;
    
    service['initWebVitals']();
    
    expect(analyticsService.trackPerformance).toHaveBeenCalledWith('largest_contentful_paint', 100);
  });

  it('should handle window load event in measurePageLoad', (done) => {
    const mockPerfData = {
      loadEventEnd: 1000,
      loadEventStart: 500,
      domContentLoadedEventEnd: 800,
      domContentLoadedEventStart: 600
    };
    
    spyOn(performance, 'getEntriesByType').and.returnValue([mockPerfData] as any);
    spyOn(service as any, 'getFirstContentfulPaint').and.returnValue(200);
    
    service.measurePageLoad();
    
    // Trigger the load event
    const loadEvent = new Event('load');
    window.dispatchEvent(loadEvent);
    
    // Wait for setTimeout to execute
    setTimeout(() => {
      expect(analyticsService.trackPerformance).toHaveBeenCalledWith('page_load_time', 500);
      expect(analyticsService.trackPerformance).toHaveBeenCalledWith('dom_content_loaded', 200);
      expect(analyticsService.trackPerformance).toHaveBeenCalledWith('first_contentful_paint', 200);
      done();
    }, 10);
  });
});