import { TestBed } from '@angular/core/testing';
import { CacheService } from './cache.service';
import { of } from 'rxjs';

describe('CacheService', () => {
  let service: CacheService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CacheService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should cache and return data', () => {
    const testData = { id: 1, name: 'test' };
    const factory = jasmine.createSpy().and.returnValue(of(testData));

    service.get('test-key', factory).subscribe(data => {
      expect(data).toEqual(testData);
    });

    expect(factory).toHaveBeenCalledTimes(1);

    // Second call should use cache
    service.get('test-key', factory).subscribe(data => {
      expect(data).toEqual(testData);
    });

    expect(factory).toHaveBeenCalledTimes(1);
  });

  it('should invalidate cache', () => {
    const factory = jasmine.createSpy().and.returnValue(of('data'));

    service.get('test-key', factory);
    service.invalidate('test-key');
    service.get('test-key', factory);

    expect(factory).toHaveBeenCalledTimes(2);
  });

  it('should clear all cache', () => {
    const factory = jasmine.createSpy().and.returnValue(of('data'));

    service.get('key1', factory);
    service.get('key2', factory);
    service.clear();
    service.get('key1', factory);
    service.get('key2', factory);

    expect(factory).toHaveBeenCalledTimes(4);
  });
});