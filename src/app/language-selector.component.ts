import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { I18nService } from './i18n.service';

@Component({
  selector: 'app-language-selector',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="language-selector">
      <button 
        class="lang-toggle" 
        (click)="toggleDropdown()" 
        [attr.aria-label]="i18n.translate('language.select')"
        [attr.aria-expanded]="isOpen">
        <span class="current-lang">
          {{ getCurrentLanguage().flag }} {{ getCurrentLanguage().name }}
        </span>
        <span class="arrow" [class.open]="isOpen">▼</span>
      </button>
      
      <div class="lang-dropdown" [class.show]="isOpen">
        <button 
          *ngFor="let lang of supportedLanguages" 
          class="lang-option"
          [class.active]="lang.code === currentLang"
          (click)="selectLanguage(lang.code)"
          [attr.aria-label]="lang.name">
          <span class="flag">{{ lang.flag }}</span>
          <span class="name">{{ lang.name }}</span>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .language-selector {
      position: relative;
      display: inline-block;
    }
    
    .lang-toggle {
      background: var(--bg-secondary, #f8f9fa);
      border: 1px solid var(--border-color, #dee2e6);
      border-radius: 6px;
      padding: 8px 12px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      color: var(--text-primary, #333);
      transition: all 0.2s ease;
    }
    
    .lang-toggle:hover {
      background: var(--bg-hover, #e9ecef);
      border-color: var(--border-hover, #adb5bd);
    }
    
    .current-lang {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    
    .arrow {
      font-size: 10px;
      transition: transform 0.2s ease;
    }
    
    .arrow.open {
      transform: rotate(180deg);
    }
    
    .lang-dropdown {
      position: absolute;
      top: 100%;
      right: 0;
      background: var(--bg-primary, white);
      border: 1px solid var(--border-color, #dee2e6);
      border-radius: 6px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      min-width: 140px;
      z-index: 1000;
      opacity: 0;
      visibility: hidden;
      transform: translateY(-10px);
      transition: all 0.2s ease;
    }
    
    .lang-dropdown.show {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }
    
    .lang-option {
      width: 100%;
      background: none;
      border: none;
      padding: 10px 12px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      color: var(--text-primary, #333);
      transition: background-color 0.2s ease;
    }
    
    .lang-option:hover {
      background: var(--bg-hover, #f8f9fa);
    }
    
    .lang-option.active {
      background: var(--primary-color, #2c3e50);
      color: white;
    }
    
    .lang-option:first-child {
      border-radius: 6px 6px 0 0;
    }
    
    .lang-option:last-child {
      border-radius: 0 0 6px 6px;
    }
    
    .flag {
      font-size: 16px;
    }
    
    .name {
      font-weight: 500;
    }
    
    @media (max-width: 768px) {
      .lang-toggle {
        padding: 6px 10px;
        font-size: 13px;
      }
      
      .current-lang .name {
        display: none;
      }
    }
  `]
})
export class LanguageSelectorComponent {
  protected i18n = inject(I18nService);
  
  isOpen = false;
  currentLang = 'en';
  supportedLanguages: any[] = [];

  constructor() {
    // Initialize current language and supported languages
    this.currentLang = this.i18n.currentLang$();
    this.supportedLanguages = this.i18n.getSupportedLanguages();
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
    
    // Close dropdown when clicking outside
    if (this.isOpen) {
      setTimeout(() => {
        document.addEventListener('click', this.closeDropdown.bind(this), { once: true });
      });
    }
  }

  closeDropdown() {
    this.isOpen = false;
  }

  selectLanguage(langCode: string) {
    this.i18n.setLanguage(langCode);
    this.isOpen = false;
  }

  getCurrentLanguage() {
    return this.supportedLanguages.find(lang => lang.code === this.currentLang) || this.supportedLanguages[0];
  }
}