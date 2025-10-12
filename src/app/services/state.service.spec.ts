import { TestBed } from '@angular/core/testing';
import { StateService } from './state.service';

describe('StateService', () => {
  let service: StateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StateService);
    document.body.className = '';
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set user', () => {
    const user = { id: '1', name: 'Test User' };
    
    service.setUser(user);
    
    expect(service.user()).toEqual(user);
  });

  it('should set theme and update body class', () => {
    service.setTheme('dark');
    
    expect(service.theme()).toBe('dark');
    expect(document.body.className).toBe('dark-theme');
  });

  it('should set loading state', () => {
    service.setLoading(true);
    
    expect(service.loading()).toBe(true);
  });

  it('should set posts', () => {
    const posts = [{ id: 1, title: 'Test Post' }];
    
    service.setPosts(posts);
    
    expect(service.posts()).toEqual(posts);
  });

  it('should add posts to existing ones', () => {
    const initialPosts = [{ id: 1, title: 'Post 1' }];
    const newPosts = [{ id: 2, title: 'Post 2' }];
    
    service.setPosts(initialPosts);
    service.addPosts(newPosts);
    
    expect(service.posts()).toEqual([...initialPosts, ...newPosts]);
  });

  it('should set media', () => {
    const media = [{ id: 1, title: 'Test Media' }];
    
    service.setMedia(media);
    
    expect(service.media()).toEqual(media);
  });

  it('should have initial state', () => {
    expect(service.user()).toBeNull();
    expect(service.theme()).toBe('light');
    expect(service.loading()).toBe(false);
    expect(service.posts()).toEqual([]);
    expect(service.media()).toEqual([]);
  });
});