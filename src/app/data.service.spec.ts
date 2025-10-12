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
    expect(result.total).toBe(8);
    expect(result.hasMore).toBe(true);
  });

  it('should get media items', () => {
    const items = service.getMediaItems();
    expect(items.length).toBe(8);
    expect(items[0].id).toBeDefined();
    expect(items[0].category).toBeDefined();
  });

  it('should get blog posts with different page sizes', () => {
    const result1 = service.getBlogPosts(1, 3);
    const result2 = service.getBlogPosts(1, 5);
    expect(result1.posts.length).toBe(3);
    expect(result2.posts.length).toBe(5);
  });

  it('should handle last page correctly', () => {
    const result = service.getBlogPosts(4, 2);
    expect(result.hasMore).toBe(false);
  });

  it('should filter media by category', () => {
    const allItems = service.getMediaItems();
    const imageItems = allItems.filter(item => item.category === 'photo');
    expect(imageItems.length).toBeLessThanOrEqual(allItems.length);
    imageItems.forEach(item => expect(item.category).toBe('photo'));
  });

  it('should add comment', () => {
    spyOn(console, 'log');
    service.addComment(1, 'Test comment', 'Test Author');
    expect(console.log).toHaveBeenCalled();
  });

  it('should get analytics', () => {
    const analytics = service.getAnalytics();
    expect(analytics.pageViews).toBeDefined();
    expect(analytics.topPages).toBeDefined();
  });
});