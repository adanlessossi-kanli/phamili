import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from './data.service';

@Component({
  selector: 'app-media',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page">
      <div class="page-header">
        <h1>Media Gallery</h1>
        <div class="breadcrumb">Home > Media</div>
        <div class="filters">
          <button *ngFor="let filter of filters" 
                  (click)="setFilter(filter)" 
                  [class.active]="selectedFilter() === filter">
            {{filter}}
          </button>
        </div>
      </div>
      <div class="gallery">
        <div *ngFor="let item of filteredItems()" 
             class="media-item" 
             (click)="openLightbox(item)">
          <div class="placeholder">{{item.type}}</div>
          <h4>{{item.title}}</h4>
          <span class="category">{{item.category}}</span>
        </div>
      </div>
      <div class="lightbox" *ngIf="selectedItem()" (click)="closeLightbox()">
        <div class="lightbox-content" (click)="$event.stopPropagation()">
          <button class="close" (click)="closeLightbox()">×</button>
          <div class="media-preview">{{selectedItem()?.type}}</div>
          <h3>{{selectedItem()?.title}}</h3>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page { padding: 20px; }
    .page-header { margin-bottom: 30px; }
    h1 { color: #2c3e50; margin-bottom: 10px; }
    .breadcrumb { color: #95a5a6; font-size: 0.9rem; margin-bottom: 20px; }
    .filters { display: flex; gap: 10px; }
    .filters button { padding: 8px 16px; border: 1px solid #ddd; background: white; border-radius: 20px; cursor: pointer; transition: all 0.3s; }
    .filters button.active, .filters button:hover { background: #2c3e50; color: white; }
    .gallery { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px; }
    .media-item { background: white; padding: 15px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); text-align: center; cursor: pointer; transition: transform 0.2s; }
    .media-item:hover { transform: translateY(-2px); box-shadow: 0 4px 8px rgba(0,0,0,0.15); }
    .placeholder { height: 120px; background: #ecf0f1; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: #95a5a6; font-size: 2rem; margin-bottom: 10px; }
    h4 { color: #2c3e50; margin: 0 0 5px 0; }
    .category { color: #95a5a6; font-size: 0.8rem; text-transform: uppercase; }
    .lightbox { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 2000; }
    .lightbox-content { background: white; padding: 30px; border-radius: 8px; max-width: 500px; position: relative; text-align: center; }
    .close { position: absolute; top: 10px; right: 15px; background: none; border: none; font-size: 24px; cursor: pointer; }
    .media-preview { font-size: 4rem; margin: 20px 0; }
  `]
})
export class MediaComponent {
  private dataService = inject(DataService);
  mediaItems = this.dataService.getMediaItems();
  selectedFilter = signal('all');
  selectedItem = signal<any>(null);
  filters = ['all', 'photo', 'video', 'audio'];

  filteredItems = signal(this.mediaItems);

  setFilter(filter: string) {
    this.selectedFilter.set(filter);
    if (filter === 'all') {
      this.filteredItems.set(this.mediaItems);
    } else {
      this.filteredItems.set(this.mediaItems.filter(item => item.category === filter));
    }
  }

  openLightbox(item: any) {
    this.selectedItem.set(item);
  }

  closeLightbox() {
    this.selectedItem.set(null);
  }
}