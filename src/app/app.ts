import { Component, signal, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './sidebar.component';
import { HeaderComponent } from './header.component';
import { ToastComponent } from './toast.component';
import { AuthService } from './auth.service';
import { I18nService } from './i18n.service';
import { NavigationService } from './services/navigation.service';
import { ServiceWorkerService } from './services/sw.service';
import { LoggerService } from './services/logger.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SidebarComponent, HeaderComponent, ToastComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('phamili');
  private authService = inject(AuthService);
  private i18nService = inject(I18nService);
  protected navigationService = inject(NavigationService);
  private swService = inject(ServiceWorkerService);
  private logger = inject(LoggerService);

  ngOnInit() {
    this.authService.checkAuth();
    this.i18nService.initLanguage();
    this.logger.info('Application initialized');
  }
}
