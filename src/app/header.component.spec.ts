import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { HeaderComponent } from './header.component';
import { DataService } from './data.service';
import { SearchService } from './search.service';
import { AuthService } from './auth.service';
import { NotificationService } from './notification.service';
import { PwaService } from './services/pwa.service';
import { I18nService } from './i18n.service';
import { LanguageSelectorComponent } from './language-selector.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let dataService: jasmine.SpyObj<DataService>;

  beforeEach(async () => {
    const dataSpy = jasmine.createSpyObj('DataService', ['toggleTheme', 'getBlogPosts', 'getMediaItems'], {
      theme: jasmine.createSpy().and.returnValue('light')
    });
    const searchSpy = jasmine.createSpyObj('SearchService', ['search']);
    const isAuthenticatedSignal = jasmine.createSpy().and.returnValue(false);
    const userSignal = jasmine.createSpy().and.returnValue(null);
    const authSpy = jasmine.createSpyObj('AuthService', ['checkAuth', 'logout'], {
      isAuthenticated$: isAuthenticatedSignal,
      user$: userSignal
    });
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const notificationSpy = jasmine.createSpyObj('NotificationService', ['info', 'success']);
    const pwaSpy = jasmine.createSpyObj('PwaService', ['installApp'], {
      canInstall: jasmine.createSpy().and.returnValue(false)
    });
    const currentLangSignal = jasmine.createSpy().and.returnValue('en');
    const i18nSpy = jasmine.createSpyObj('I18nService', ['translate', 'getSupportedLanguages'], {
      currentLang$: currentLangSignal
    });
    i18nSpy.translate.and.callFake((key: string) => {
      const translations: { [key: string]: string } = {
        'common.search': 'Search...',
        'theme.toggle': 'Toggle Theme',
        'nav.logout': 'Logout',
        'nav.login': 'Login'
      };
      return translations[key] || key;
    });
    i18nSpy.getSupportedLanguages.and.returnValue([
      { code: 'en', name: 'English', flag: '🇺🇸' },
      { code: 'fr', name: 'Français', flag: '🇫🇷' }
    ]);
    
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
        { provide: DataService, useValue: dataSpy },
        { provide: SearchService, useValue: searchSpy },
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpy },
        { provide: NotificationService, useValue: notificationSpy },
        { provide: PwaService, useValue: pwaSpy },
        { provide: I18nService, useValue: i18nSpy }
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

  it('should install PWA app successfully', async () => {
    const pwaService = TestBed.inject(PwaService) as jasmine.SpyObj<PwaService>;
    pwaService.installApp.and.returnValue(Promise.resolve(true));
    
    await component.installApp();
    
    expect(pwaService.installApp).toHaveBeenCalled();
    expect(component.notificationService.success).toHaveBeenCalledWith('App installed successfully!');
  });

  it('should handle PWA install failure silently', async () => {
    const pwaService = TestBed.inject(PwaService) as jasmine.SpyObj<PwaService>;
    pwaService.installApp.and.returnValue(Promise.resolve(false));
    
    await component.installApp();
    
    expect(pwaService.installApp).toHaveBeenCalled();
    expect(component.notificationService.success).not.toHaveBeenCalled();
  });

  it('should handle search with empty query', () => {
    component.searchQuery = '';
    component.performSearch();
    expect(component.router.navigate).not.toHaveBeenCalled();
  });

  it('should render language selector', () => {
    const compiled = fixture.nativeElement;
    const languageSelector = compiled.querySelector('app-language-selector');
    expect(languageSelector).toBeTruthy();
  });

  it('should use i18n translations', () => {
    const i18nService = TestBed.inject(I18nService) as jasmine.SpyObj<I18nService>;
    expect(i18nService.translate).toHaveBeenCalledWith('common.search');
  });

  it('should handle search with short query', () => {
    const event = { target: { value: 'ab' } };
    component.onSearch(event);
    expect(component.searchResults).toBeNull();
  });

  it('should handle search with long query', () => {
    const searchService = TestBed.inject(SearchService) as jasmine.SpyObj<SearchService>;
    searchService.search.and.stub();
    
    const event = { target: { value: 'test query' } };
    component.onSearch(event);
    expect(searchService.search).toHaveBeenCalledWith('test query');
  });

  it('should navigate to media from search', () => {
    component.navigateToMedia();
    expect(component.router.navigate).toHaveBeenCalledWith(['/media']);
    expect(component.searchResults).toBeNull();
  });

  it('should clear search results after navigation', () => {
    component.searchResults = { posts: [], media: [] };
    component.navigateToPost({});
    expect(component.searchResults).toBeNull();
  });

  it('should close user menu after logout', () => {
    component.showUserMenu = true;
    component.logout();
    expect(component.showUserMenu).toBeFalse();
  });
});