import { TestBed } from '@angular/core/testing';
import { Router, NavigationEnd } from '@angular/router';
import { NavigationService } from './navigation.service';
import { Subject } from 'rxjs';

describe('NavigationService', () => {
  let service: NavigationService;
  let router: jasmine.SpyObj<Router>;
  let routerEvents: Subject<any>;

  beforeEach(() => {
    routerEvents = new Subject();
    const routerSpy = jasmine.createSpyObj('Router', ['navigate'], {
      events: routerEvents,
      url: '/home'
    });

    TestBed.configureTestingModule({
      providers: [{ provide: Router, useValue: routerSpy }]
    });
    service = TestBed.inject(NavigationService);
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should navigate to path', () => {
    service.navigateTo('/test');
    expect(router.navigate).toHaveBeenCalledWith(['/test']);
  });

  it('should update breadcrumbs on navigation', () => {
    Object.defineProperty(router, 'url', { value: '/blog/post/1' });
    routerEvents.next(new NavigationEnd(1, '/blog/post/1', '/blog/post/1'));
    
    const breadcrumbs = service.breadcrumbs$();
    expect(breadcrumbs.length).toBeGreaterThan(1);
    expect(breadcrumbs[0].label).toBe('Home');
  });
});