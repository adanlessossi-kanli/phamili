import { Injectable } from '@angular/core';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ServiceWorkerService {
  constructor(private swUpdate: SwUpdate) {
    if (swUpdate.isEnabled) {
      this.checkForUpdates();
    }
  }

  private checkForUpdates() {
    this.swUpdate.versionUpdates
      .pipe(filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY'))
      .subscribe(() => {
        if (confirm('New version available. Load?')) {
          window.location.reload();
        }
      });

    // Check for updates every 6 hours
    setInterval(() => this.swUpdate.checkForUpdate(), 6 * 60 * 60 * 1000);
  }

  activateUpdate() {
    this.swUpdate.activateUpdate().then(() => document.location.reload());
  }
}