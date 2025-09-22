import { Injectable, signal } from '@angular/core';

interface Translations {
  [key: string]: { [lang: string]: string };
}

@Injectable({
  providedIn: 'root'
})
export class I18nService {
  private currentLang = signal('en');
  currentLang$ = this.currentLang.asReadonly();

  private translations: Translations = {
    'nav.home': { en: 'Home', es: 'Inicio', fr: 'Accueil', de: 'Startseite' },
    'nav.blog': { en: 'Blog', es: 'Blog', fr: 'Blog', de: 'Blog' },
    'nav.media': { en: 'Media', es: 'Medios', fr: 'Médias', de: 'Medien' },
    'nav.about': { en: 'About', es: 'Acerca de', fr: 'À propos', de: 'Über uns' },
    'common.loading': { en: 'Loading...', es: 'Cargando...', fr: 'Chargement...', de: 'Laden...' },
    'common.search': { en: 'Search...', es: 'Buscar...', fr: 'Rechercher...', de: 'Suchen...' },
    'auth.login': { en: 'Login', es: 'Iniciar sesión', fr: 'Connexion', de: 'Anmelden' },
    'auth.logout': { en: 'Logout', es: 'Cerrar sesión', fr: 'Déconnexion', de: 'Abmelden' },
    'home.welcome': { en: 'Welcome to Phamili', es: 'Bienvenido a Phamili', fr: 'Bienvenue à Phamili', de: 'Willkommen bei Phamili' }
  };

  setLanguage(lang: string) {
    this.currentLang.set(lang);
    localStorage.setItem('phamili_lang', lang);
    document.documentElement.lang = lang;
  }

  translate(key: string): string {
    const translation = this.translations[key];
    if (!translation) return key;
    return translation[this.currentLang()] || translation['en'] || key;
  }

  getSupportedLanguages() {
    return [
      { code: 'en', name: 'English', flag: '🇺🇸' },
      { code: 'es', name: 'Español', flag: '🇪🇸' },
      { code: 'fr', name: 'Français', flag: '🇫🇷' },
      { code: 'de', name: 'Deutsch', flag: '🇩🇪' }
    ];
  }

  initLanguage() {
    const saved = localStorage.getItem('phamili_lang');
    const browser = navigator.language.split('-')[0];
    const lang = saved || (this.translations['nav.home'][browser] ? browser : 'en');
    this.setLanguage(lang);
  }
}