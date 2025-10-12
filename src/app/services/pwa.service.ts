import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PwaService {
  private deferredPrompt = signal<any>(null);
  canInstall = signal(false);

  constructor() {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt.set(e);
      this.canInstall.set(true);
    });
  }

  async installApp() {
    const prompt = this.deferredPrompt();
    if (prompt) {
      prompt.prompt();
      const result = await prompt.userChoice;
      this.deferredPrompt.set(null);
      this.canInstall.set(false);
      return result.outcome === 'accepted';
    }
    return false;
  }
}