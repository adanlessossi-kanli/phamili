import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HomeComponent } from './home.component';
import { I18nService } from './i18n.service';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let i18nService: jasmine.SpyObj<I18nService>;

  beforeEach(async () => {
    const i18nSpy = jasmine.createSpyObj('I18nService', ['translate']);
    i18nSpy.translate.and.callFake((key: string) => {
      const translations: { [key: string]: string } = {
        'home.welcome': 'Welcome to Phamili',
        'home.subtitle': 'A modern Angular web application',
        'nav.blog': 'Blog',
        'nav.media': 'Media',
        'home.features.modern': 'Modern Design',
        'home.features.fast': 'Fast Performance',
        'home.features.responsive': 'Responsive'
      };
      return translations[key] || key;
    });

    await TestBed.configureTestingModule({
      imports: [HomeComponent, RouterTestingModule],
      providers: [
        { provide: I18nService, useValue: i18nSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    i18nService = TestBed.inject(I18nService) as jasmine.SpyObj<I18nService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render welcome message', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Welcome to Phamili');
    expect(i18nService.translate).toHaveBeenCalledWith('home.welcome');
  });

  it('should render subtitle', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.hero p').textContent).toContain('A modern Angular web application');
    expect(i18nService.translate).toHaveBeenCalledWith('home.subtitle');
  });

  it('should have CTA buttons', () => {
    const compiled = fixture.nativeElement;
    const buttons = compiled.querySelectorAll('.btn');
    expect(buttons.length).toBe(2);
  });

  it('should have feature cards', () => {
    const compiled = fixture.nativeElement;
    const cards = compiled.querySelectorAll('.feature-card');
    expect(cards.length).toBe(3);
  });

  it('should translate feature titles', () => {
    expect(i18nService.translate).toHaveBeenCalledWith('home.features.modern');
    expect(i18nService.translate).toHaveBeenCalledWith('home.features.fast');
    expect(i18nService.translate).toHaveBeenCalledWith('home.features.responsive');
  });

  it('should have proper routing links', () => {
    const compiled = fixture.nativeElement;
    const blogLink = compiled.querySelector('a[routerLink="/blog"]');
    const mediaLink = compiled.querySelector('a[routerLink="/media"]');
    expect(blogLink).toBeTruthy();
    expect(mediaLink).toBeTruthy();
  });

  it('should have hero section with proper styling', () => {
    const compiled = fixture.nativeElement;
    const hero = compiled.querySelector('.hero');
    expect(hero).toBeTruthy();
  });

  it('should have features grid', () => {
    const compiled = fixture.nativeElement;
    const features = compiled.querySelector('.features');
    expect(features).toBeTruthy();
  });

  it('should have feature icons', () => {
    const compiled = fixture.nativeElement;
    const icons = compiled.querySelectorAll('.feature-card .icon');
    expect(icons.length).toBe(3);
  });
});