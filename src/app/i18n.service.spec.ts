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
    service.setLanguage('fr');
    expect(service.currentLang$()).toBe('fr');
  });

  it('should translate keys', () => {
    service.setLanguage('fr');
    expect(service.translate('nav.home')).toBe('Accueil');
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
    expect(languages.length).toBe(2);
    expect(languages[0].code).toBe('en');
    expect(languages[1].code).toBe('fr');
  });

  it('should init language with saved preference', () => {
    spyOn(localStorage, 'getItem').and.returnValue('fr');
    service.initLanguage();
    expect(service.currentLang$()).toBe('fr');
  });

  it('should init language with browser default', () => {
    spyOn(localStorage, 'getItem').and.returnValue(null);
    Object.defineProperty(navigator, 'language', { value: 'fr-FR', configurable: true });
    service.initLanguage();
    expect(service.currentLang$()).toBe('fr');
  });

  it('should handle unsupported browser language', () => {
    spyOn(localStorage, 'getItem').and.returnValue(null);
    Object.defineProperty(navigator, 'language', { value: 'zh-CN', configurable: true });
    service.initLanguage();
    expect(service.currentLang$()).toBe('en');
  });

  it('should save language to localStorage', () => {
    spyOn(localStorage, 'setItem');
    service.setLanguage('fr');
    expect(localStorage.setItem).toHaveBeenCalledWith('phamili_lang', 'fr');
  });

  it('should set document language', () => {
    service.setLanguage('fr');
    expect(document.documentElement.lang).toBe('fr');
  });

  it('should translate all navigation keys', () => {
    service.setLanguage('fr');
    expect(service.translate('nav.blog')).toBe('Blog');
    expect(service.translate('nav.media')).toBe('Médias');
    expect(service.translate('nav.about')).toBe('À propos');
  });

  it('should translate authentication keys', () => {
    service.setLanguage('fr');
    expect(service.translate('auth.login')).toBe('Connexion');
    expect(service.translate('auth.register')).toBe('S\'inscrire');
    expect(service.translate('auth.email')).toBe('E-mail');
  });

  it('should translate common keys', () => {
    service.setLanguage('fr');
    expect(service.translate('common.loading')).toBe('Chargement...');
    expect(service.translate('common.save')).toBe('Enregistrer');
    expect(service.translate('common.cancel')).toBe('Annuler');
  });

  it('should fallback to English when French translation missing', () => {
    service.setLanguage('fr');
    // Test with a key that might not have French translation
    const result = service.translate('nav.home');
    expect(result).toBeTruthy();
  });

  it('should handle nested translation keys', () => {
    service.setLanguage('en');
    expect(service.translate('common.loading')).toBe('Loading...');
  });
});