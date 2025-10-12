import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { I18nService } from './i18n.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="page">
      <div class="hero">
        <h1>{{i18n.translate('home.welcome')}}</h1>
        <p>{{i18n.translate('home.subtitle')}}</p>
        <div class="cta-buttons">
          <a routerLink="/blog" class="btn primary">{{i18n.translate('nav.blog')}}</a>
          <a routerLink="/media" class="btn secondary">{{i18n.translate('nav.media')}}</a>
        </div>
      </div>
      <div class="features">
        <div class="feature-card">
          <div class="icon">🎨</div>
          <h3>{{i18n.translate('home.features.modern')}}</h3>
          <p>Clean interface with dark/light themes and smooth animations</p>
        </div>
        <div class="feature-card">
          <div class="icon">⚡</div>
          <h3>{{i18n.translate('home.features.fast')}}</h3>
          <p>Optimized with Angular signals and lazy loading</p>
        </div>
        <div class="feature-card">
          <div class="icon">📱</div>
          <h3>{{i18n.translate('home.features.responsive')}}</h3>
          <p>Perfect experience across all devices and screen sizes</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page { padding: 20px; }
    .hero { text-align: center; padding: 60px 0; }
    .hero h1 { color: #2c3e50; font-size: 3rem; margin-bottom: 20px; }
    .hero p { color: #7f8c8d; font-size: 1.2rem; margin-bottom: 40px; }
    .cta-buttons { display: flex; gap: 20px; justify-content: center; }
    .btn { padding: 15px 30px; text-decoration: none; border-radius: 6px; font-weight: 500; transition: all 0.3s; }
    .btn.primary { background: #2c3e50; color: white; }
    .btn.secondary { background: transparent; color: #2c3e50; border: 2px solid #2c3e50; }
    .btn:hover { transform: translateY(-2px); box-shadow: 0 4px 8px rgba(0,0,0,0.15); }
    .features { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 30px; margin-top: 60px; }
    .feature-card { background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); text-align: center; transition: transform 0.3s; }
    .feature-card:hover { transform: translateY(-5px); }
    .feature-card .icon { font-size: 3rem; margin-bottom: 20px; }
    .feature-card h3 { color: #2c3e50; margin-bottom: 15px; }
    .feature-card p { color: #7f8c8d; line-height: 1.6; }
  `]
})
export class HomeComponent {
  i18n = inject(I18nService);
}