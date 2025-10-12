import { TestBed } from '@angular/core/testing';
import { StorageService } from './storage.service';

describe('StorageService', () => {
  let service: StorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StorageService);
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set and get items', () => {
    const testData = { id: 1, name: 'test' };
    service.setItem('test-key', testData);
    
    const retrieved = service.getItem('test-key');
    expect(retrieved).toEqual(testData);
  });

  it('should remove items', () => {
    service.setItem('test-key', 'test-value');
    service.removeItem('test-key');
    
    expect(service.getItem('test-key')).toBeNull();
  });

  it('should clear all items', () => {
    service.setItem('key1', 'value1');
    service.setItem('key2', 'value2');
    service.clear();
    
    expect(service.getItem('key1')).toBeNull();
    expect(service.getItem('key2')).toBeNull();
  });

  it('should save and get offline data', () => {
    const testData = { posts: [1, 2, 3] };
    service.saveOfflineData('posts', testData);
    
    const retrieved = service.getOfflineData('posts');
    expect(retrieved).toEqual(testData);
  });

  it('should return null for expired offline data', () => {
    const testData = { posts: [1, 2, 3] };
    service.saveOfflineData('posts', testData);
    
    const retrieved = service.getOfflineData('posts', -1); // Negative max age to force expiration
    expect(retrieved).toBeNull();
  });
});