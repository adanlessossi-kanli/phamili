import { TestBed } from '@angular/core/testing';
import { DataService } from './data.service';

describe('DataService', () => {
  let service: DataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should toggle theme', () => {
    expect(service.theme()).toBe('light');
    service.toggleTheme();
    expect(service.theme()).toBe('dark');
    service.toggleTheme();
    expect(service.theme()).toBe('light');
  });

  it('should get blog posts with pagination', () => {
    const result = service.getBlogPosts(1, 2);
    expect(result.posts.length).toBe(2);
    expect(result.total).toBe(4);
    expect(result.hasMore).toBe(true);
  });

  it('should get media items', () => {
    const items = service.getMediaItems();
    expect(items.length).toBe(6);
    expect(items[0].id).toBeDefined();
    expect(items[0].category).toBeDefined();
  });
});