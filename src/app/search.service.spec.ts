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

  it('should search and update results signal', () => {
    service.search('test');
    expect(service.searchQuery$()).toBe('test');
    expect(service.isSearching$()).toBe(true);
  });

  it('should clear search results', () => {
    service.search('test');
    service.clearSearch();
    expect(service.searchQuery$()).toBe('');
    expect(service.searchResults$().length).toBe(0);
  });

  it('should handle empty query', () => {
    service.search('');
    expect(service.searchResults$().length).toBe(0);
    expect(service.isSearching$()).toBe(false);
  });

  it('should set searching state', () => {
    service.search('test');
    expect(service.isSearching$()).toBe(true);
  });
});