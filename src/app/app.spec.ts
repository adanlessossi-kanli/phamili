import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { App } from './app';
import { DataService } from './data.service';
import { AuthService } from './auth.service';
import { I18nService } from './i18n.service';
import { ServiceWorkerService } from './services/sw.service';

describe('App', () => {
  let dataService: jasmine.SpyObj<DataService>;
  let authService: jasmine.SpyObj<AuthService>;
  let i18nService: jasmine.SpyObj<I18nService>;
  let serviceWorkerService: jasmine.SpyObj<ServiceWorkerService>;

  beforeEach(async () => {
    const dataSpy = jasmine.createSpyObj('DataService', ['toggleTheme'], {
      theme: jasmine.createSpy().and.returnValue('light')
    });
    const authSpy = jasmine.createSpyObj('AuthService', ['checkAuth'], {
      isAuthenticated$: jasmine.createSpy().and.returnValue(false),
      user$: jasmine.createSpy().and.returnValue(null)
    });
    const currentLangSignal = jasmine.createSpy().and.returnValue('en');
    const i18nSpy = jasmine.createSpyObj('I18nService', ['initLanguage', 'translate', 'getSupportedLanguages'], {
      currentLang$: currentLangSignal
    });
    i18nSpy.getSupportedLanguages.and.returnValue([
      { code: 'en', name: 'English', flag: '🇺🇸' },
      { code: 'fr', name: 'Français', flag: '🇫🇷' }
    ]);
    i18nSpy.translate.and.returnValue('test');

    const swSpy = jasmine.createSpyObj('ServiceWorkerService', ['checkForUpdate', 'activateUpdate'], {
      isEnabled: jasmine.createSpy().and.returnValue(false),
      updateAvailable$: jasmine.createSpy().and.returnValue(false)
    });

    await TestBed.configureTestingModule({
      imports: [App, RouterTestingModule],
      providers: [
        { provide: DataService, useValue: dataSpy },
        { provide: AuthService, useValue: authSpy },
        { provide: I18nService, useValue: i18nSpy },
        { provide: ServiceWorkerService, useValue: swSpy }
      ]
    }).compileComponents();

    dataService = TestBed.inject(DataService) as jasmine.SpyObj<DataService>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    i18nService = TestBed.inject(I18nService) as jasmine.SpyObj<I18nService>;
    serviceWorkerService = TestBed.inject(ServiceWorkerService) as jasmine.SpyObj<ServiceWorkerService>;
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should have the phamili title', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance as any;
    expect(app.title()).toEqual('phamili');
  });

  it('should render layout components', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-sidebar')).toBeTruthy();
    expect(compiled.querySelector('app-header')).toBeTruthy();
    expect(compiled.querySelector('router-outlet')).toBeTruthy();
  });

  it('should have app layout structure', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.app-layout')).toBeTruthy();
    expect(compiled.querySelector('.main-content')).toBeTruthy();
    expect(compiled.querySelector('.content')).toBeTruthy();
  });

  it('should initialize auth service on init', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    app.ngOnInit();
    expect(authService.checkAuth).toHaveBeenCalled();
  });

  it('should initialize i18n service on init', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    app.ngOnInit();
    expect(i18nService.initLanguage).toHaveBeenCalled();
  });

  it('should render toast component', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-toast')).toBeTruthy();
  });

  it('should call ngOnInit lifecycle hook', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    app.ngOnInit();
    expect(authService.checkAuth).toHaveBeenCalled();
    expect(i18nService.initLanguage).toHaveBeenCalled();
  });
});
