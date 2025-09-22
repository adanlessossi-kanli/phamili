import { TestBed } from '@angular/core/testing';
import { I18nService } from './i18n.service';

describe('I18nService', () => {
  let service: I18nService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(I18nService);
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set language', () => {
    service.setLanguage('es');
    expect(service.currentLang$()).toBe('es');
  });

  it('should translate keys', () => {
    service.setLanguage('es');
    expect(service.translate('nav.home')).toBe('Inicio');
  });

  it('should fallback to English for unknown language', () => {
    service.setLanguage('unknown');
    expect(service.translate('nav.home')).toBe('Home');
  });

  it('should return key for unknown translation', () => {
    expect(service.translate('unknown.key')).toBe('unknown.key');
  });

  it('should get supported languages', () => {
    const languages = service.getSupportedLanguages();
    expect(languages.length).toBe(4);
    expect(languages[0].code).toBe('en');
  });

  it('should init language with saved preference', () => {
    spyOn(localStorage, 'getItem').and.returnValue('es');
    service.initLanguage();
    expect(service.currentLang$()).toBe('es');
  });

  it('should init language with browser default', () => {
    spyOn(localStorage, 'getItem').and.returnValue(null);
    Object.defineProperty(navigator, 'language', { value: 'fr-FR', configurable: true });
    service.initLanguage();
    expect(service.currentLang$()).toBe('fr');
  });
});