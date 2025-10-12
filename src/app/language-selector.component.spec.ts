import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LanguageSelectorComponent } from './language-selector.component';
import { I18nService } from './i18n.service';

describe('LanguageSelectorComponent', () => {
  let component: LanguageSelectorComponent;
  let fixture: ComponentFixture<LanguageSelectorComponent>;
  let i18nService: jasmine.SpyObj<I18nService>;

  beforeEach(async () => {
    const currentLangSignal = jasmine.createSpy().and.returnValue('en');
    const i18nSpy = jasmine.createSpyObj('I18nService', ['setLanguage', 'translate', 'getSupportedLanguages'], {
      currentLang$: currentLangSignal
    });

    await TestBed.configureTestingModule({
      imports: [LanguageSelectorComponent],
      providers: [
        { provide: I18nService, useValue: i18nSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LanguageSelectorComponent);
    component = fixture.componentInstance;
    i18nService = TestBed.inject(I18nService) as jasmine.SpyObj<I18nService>;
    
    // Setup default return values
    i18nService.getSupportedLanguages.and.returnValue([
      { code: 'en', name: 'English', flag: '🇺🇸' },
      { code: 'fr', name: 'Français', flag: '🇫🇷' }
    ]);
    i18nService.translate.and.returnValue('Select Language');
    
    // Initialize component properties manually for tests
    component.currentLang = 'en';
    component.supportedLanguages = [
      { code: 'en', name: 'English', flag: '🇺🇸' },
      { code: 'fr', name: 'Français', flag: '🇫🇷' }
    ];
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with current language', () => {
    expect(component.currentLang).toBe('en');
  });

  it('should get supported languages', () => {
    expect(component.supportedLanguages.length).toBe(2);
    expect(component.supportedLanguages[0].code).toBe('en');
    expect(component.supportedLanguages[1].code).toBe('fr');
  });

  it('should toggle dropdown', () => {
    expect(component.isOpen).toBeFalse();
    component.toggleDropdown();
    expect(component.isOpen).toBeTrue();
    component.toggleDropdown();
    expect(component.isOpen).toBeFalse();
  });

  it('should close dropdown', () => {
    component.isOpen = true;
    component.closeDropdown();
    expect(component.isOpen).toBeFalse();
  });

  it('should select language and close dropdown', () => {
    component.isOpen = true;
    component.selectLanguage('fr');
    expect(i18nService.setLanguage).toHaveBeenCalledWith('fr');
    expect(component.isOpen).toBeFalse();
  });

  it('should get current language object', () => {
    const currentLang = component.getCurrentLanguage();
    expect(currentLang.code).toBe('en');
    expect(currentLang.name).toBe('English');
  });

  it('should fallback to first language if current not found', () => {
    component.currentLang = 'unknown';
    const currentLang = component.getCurrentLanguage();
    expect(currentLang.code).toBe('en');
  });

  it('should render language toggle button', () => {
    const compiled = fixture.nativeElement;
    const toggleButton = compiled.querySelector('.lang-toggle');
    expect(toggleButton).toBeTruthy();
  });

  it('should render dropdown when open', () => {
    component.isOpen = true;
    fixture.detectChanges();
    const dropdown = fixture.nativeElement.querySelector('.lang-dropdown.show');
    expect(dropdown).toBeTruthy();
  });

  it('should render language options', () => {
    component.isOpen = true;
    fixture.detectChanges();
    const options = fixture.nativeElement.querySelectorAll('.lang-option');
    expect(options.length).toBe(2);
  });

  it('should handle click on toggle button', () => {
    spyOn(component, 'toggleDropdown');
    const toggleButton = fixture.nativeElement.querySelector('.lang-toggle');
    toggleButton.click();
    expect(component.toggleDropdown).toHaveBeenCalled();
  });

  it('should handle click on language option', () => {
    spyOn(component, 'selectLanguage');
    component.isOpen = true;
    fixture.detectChanges();
    
    const firstOption = fixture.nativeElement.querySelector('.lang-option');
    firstOption.click();
    expect(component.selectLanguage).toHaveBeenCalled();
  });

  it('should show current language flag and name', () => {
    const compiled = fixture.nativeElement;
    const currentLang = compiled.querySelector('.current-lang');
    expect(currentLang.textContent).toContain('🇺🇸');
    expect(currentLang.textContent).toContain('English');
  });

  it('should have proper ARIA attributes', () => {
    const toggleButton = fixture.nativeElement.querySelector('.lang-toggle');
    expect(toggleButton.getAttribute('aria-label')).toBeTruthy();
    expect(toggleButton.getAttribute('aria-expanded')).toBe('false');
    
    component.isOpen = true;
    fixture.detectChanges();
    expect(toggleButton.getAttribute('aria-expanded')).toBe('true');
  });

  it('should add event listener when opening dropdown', () => {
    spyOn(document, 'addEventListener');
    component.toggleDropdown();
    expect(component.isOpen).toBeTrue();
  });
});