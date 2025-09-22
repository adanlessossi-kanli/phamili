import { TestBed } from '@angular/core/testing';
import { SearchService } from './search.service';
import { DataService } from './data.service';

describe('SearchService', () => {
  let service: SearchService;
  let dataService: jasmine.SpyObj<DataService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('DataService', ['getBlogPosts', 'getMediaItems']);
    spy.getBlogPosts.and.returnValue({
      posts: [{ title: 'Angular Test', excerpt: 'Testing Angular apps' }],
      total: 1, hasMore: false
    });
    spy.getMediaItems.and.returnValue([
      { title: 'Test Image', category: 'photo' }
    ]);

    TestBed.configureTestingModule({
      providers: [{ provide: DataService, useValue: spy }]
    });
    service = TestBed.inject(SearchService);
    dataService = TestBed.inject(DataService) as jasmine.SpyObj<DataService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should search posts and media', () => {
    const results = service.search('test');
    expect(results.posts.length).toBe(1);
    expect(results.media.length).toBe(1);
  });

  it('should return empty results for empty query', () => {
    const results = service.search('');
    expect(results.posts.length).toBe(0);
    expect(results.media.length).toBe(0);
  });

  it('should clear search', () => {
    service.search('test');
    service.clearSearch();
    expect(service.searchQuery$()).toBe('');
  });
});