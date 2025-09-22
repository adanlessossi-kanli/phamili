import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { HeaderComponent } from './header.component';
import { DataService } from './data.service';
import { SearchService } from './search.service';
import { AuthService } from './auth.service';
import { NotificationService } from './notification.service';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let dataService: jasmine.SpyObj<DataService>;

  beforeEach(async () => {
    const dataSpy = jasmine.createSpyObj('DataService', ['toggleTheme', 'getBlogPosts', 'getMediaItems'], {
      theme: jasmine.createSpy().and.returnValue('light')
    });
    const searchSpy = jasmine.createSpyObj('SearchService', ['search']);
    const authSpy = jasmine.createSpyObj('AuthService', ['checkAuth', 'logout'], {
      isAuthenticated$: jasmine.createSpy().and.returnValue(false),
      user$: jasmine.createSpy().and.returnValue(null)
    });
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const notificationSpy = jasmine.createSpyObj('NotificationService', ['info', 'success']);
    
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
        { provide: DataService, useValue: dataSpy },
        { provide: SearchService, useValue: searchSpy },
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpy },
        { provide: NotificationService, useValue: notificationSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    dataService = TestBed.inject(DataService) as jasmine.SpyObj<DataService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle theme', () => {
    component.toggleTheme();
    expect(dataService.toggleTheme).toHaveBeenCalled();
  });

  it('should handle search', () => {
    const event = { target: { value: 'test' } };
    component.onSearch(event);
    expect(component.searchQuery).toBe('test');
  });

  it('should perform search', () => {
    component.searchQuery = 'test';
    component.performSearch();
    expect(component.router.navigate).toHaveBeenCalledWith(['/search'], { queryParams: { q: 'test' } });
  });

  it('should navigate to post', () => {
    component.navigateToPost({});
    expect(component.router.navigate).toHaveBeenCalledWith(['/blog']);
  });

  it('should show notification', () => {
    component.showNotification();
    expect(component.notificationService.info).toHaveBeenCalled();
  });

  it('should toggle user menu', () => {
    expect(component.showUserMenu).toBe(false);
    component.toggleUserMenu();
    expect(component.showUserMenu).toBe(true);
  });

  it('should logout', () => {
    component.logout();
    expect(component.authService.logout).toHaveBeenCalled();
    expect(component.router.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('should go to login', () => {
    component.goToLogin();
    expect(component.router.navigate).toHaveBeenCalledWith(['/login']);
  });
});