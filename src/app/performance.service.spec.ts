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
});