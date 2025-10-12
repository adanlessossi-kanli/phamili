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
    // Navigation
    'nav.home': { en: 'Home', fr: 'Accueil' },
    'nav.blog': { en: 'Blog', fr: 'Blog' },
    'nav.media': { en: 'Media', fr: 'Médias' },
    'nav.about': { en: 'About', fr: 'À propos' },
    'nav.login': { en: 'Login', fr: 'Connexion' },
    'nav.logout': { en: 'Logout', fr: 'Déconnexion' },
    
    // Common
    'common.loading': { en: 'Loading...', fr: 'Chargement...' },
    'common.search': { en: 'Search...', fr: 'Rechercher...' },
    'common.save': { en: 'Save', fr: 'Enregistrer' },
    'common.cancel': { en: 'Cancel', fr: 'Annuler' },
    'common.submit': { en: 'Submit', fr: 'Soumettre' },
    'common.close': { en: 'Close', fr: 'Fermer' },
    'common.edit': { en: 'Edit', fr: 'Modifier' },
    'common.delete': { en: 'Delete', fr: 'Supprimer' },
    'common.view': { en: 'View', fr: 'Voir' },
    'common.back': { en: 'Back', fr: 'Retour' },
    'common.next': { en: 'Next', fr: 'Suivant' },
    'common.previous': { en: 'Previous', fr: 'Précédent' },
    
    // Home page
    'home.welcome': { en: 'Welcome to Phamili', fr: 'Bienvenue à Phamili' },
    'home.subtitle': { en: 'A modern Angular web application', fr: 'Une application web Angular moderne' },
    'home.features.title': { en: 'Features', fr: 'Fonctionnalités' },
    'home.features.modern': { en: 'Modern Design', fr: 'Design Moderne' },
    'home.features.fast': { en: 'Fast Performance', fr: 'Performance Rapide' },
    'home.features.responsive': { en: 'Responsive', fr: 'Responsive' },
    'home.features.tested': { en: '100% Test Coverage', fr: 'Couverture de Test 100%' },
    'home.features.accessible': { en: 'Accessible', fr: 'Accessible' },
    'home.features.seo': { en: 'SEO Ready', fr: 'Prêt pour le SEO' },
    
    // Authentication
    'auth.login': { en: 'Login', fr: 'Connexion' },
    'auth.register': { en: 'Register', fr: 'S\'inscrire' },
    'auth.email': { en: 'Email', fr: 'E-mail' },
    'auth.password': { en: 'Password', fr: 'Mot de passe' },
    'auth.name': { en: 'Full Name', fr: 'Nom complet' },
    'auth.confirmPassword': { en: 'Confirm Password', fr: 'Confirmer le mot de passe' },
    'auth.forgotPassword': { en: 'Forgot Password?', fr: 'Mot de passe oublié ?' },
    'auth.noAccount': { en: 'Don\'t have an account?', fr: 'Vous n\'avez pas de compte ?' },
    'auth.hasAccount': { en: 'Already have an account?', fr: 'Vous avez déjà un compte ?' },
    'auth.processing': { en: 'Processing...', fr: 'Traitement...' },
    'auth.loginSuccess': { en: 'Login successful!', fr: 'Connexion réussie !' },
    'auth.loginError': { en: 'Invalid credentials', fr: 'Identifiants invalides' },
    'auth.registerSuccess': { en: 'Registration successful! Please check your email.', fr: 'Inscription réussie ! Vérifiez votre e-mail.' },
    'auth.confirmAccount': { en: 'Confirm Your Account', fr: 'Confirmez votre compte' },
    'auth.verificationCode': { en: 'Verification Code', fr: 'Code de vérification' },
    'auth.confirm': { en: 'Confirm', fr: 'Confirmer' },
    
    // Blog
    'blog.title': { en: 'Blog Posts', fr: 'Articles de blog' },
    'blog.readMore': { en: 'Read More', fr: 'Lire la suite' },
    'blog.publishedOn': { en: 'Published on', fr: 'Publié le' },
    'blog.author': { en: 'Author', fr: 'Auteur' },
    'blog.category': { en: 'Category', fr: 'Catégorie' },
    'blog.tags': { en: 'Tags', fr: 'Étiquettes' },
    'blog.noResults': { en: 'No blog posts found', fr: 'Aucun article de blog trouvé' },
    
    // Media
    'media.title': { en: 'Media Gallery', fr: 'Galerie multimédia' },
    'media.filter.all': { en: 'All', fr: 'Tout' },
    'media.filter.images': { en: 'Images', fr: 'Images' },
    'media.filter.videos': { en: 'Videos', fr: 'Vidéos' },
    'media.noResults': { en: 'No media found', fr: 'Aucun média trouvé' },
    
    // About
    'about.title': { en: 'About Us', fr: 'À propos de nous' },
    'about.contact': { en: 'Contact Us', fr: 'Nous contacter' },
    'about.message': { en: 'Message', fr: 'Message' },
    'about.send': { en: 'Send Message', fr: 'Envoyer le message' },
    'about.messageSent': { en: 'Message sent successfully!', fr: 'Message envoyé avec succès !' },
    
    // Errors
    'error.404.title': { en: 'Page Not Found', fr: 'Page non trouvée' },
    'error.404.message': { en: 'The page you are looking for does not exist.', fr: 'La page que vous recherchez n\'existe pas.' },
    'error.generic': { en: 'An error occurred. Please try again.', fr: 'Une erreur s\'est produite. Veuillez réessayer.' },
    
    // Theme
    'theme.toggle': { en: 'Toggle Theme', fr: 'Changer de thème' },
    'theme.light': { en: 'Light Mode', fr: 'Mode clair' },
    'theme.dark': { en: 'Dark Mode', fr: 'Mode sombre' },
    
    // Language
    'language.select': { en: 'Select Language', fr: 'Choisir la langue' },
    'language.english': { en: 'English', fr: 'Anglais' },
    'language.french': { en: 'French', fr: 'Français' }
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
      { code: 'fr', name: 'Français', flag: '🇫🇷' }
    ];
  }

  initLanguage() {
    const saved = localStorage.getItem('phamili_lang');
    const browser = navigator.language.split('-')[0];
    const supportedLangs = ['en', 'fr'];
    const lang = saved || (supportedLangs.includes(browser) ? browser : 'en');
    this.setLanguage(lang);
  }
}