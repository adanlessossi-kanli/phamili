import { Component, Input, Output, EventEmitter, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav class="pagination" [attr.aria-label]="'Pagination Navigation'">
      <button 
        class="pagination-btn"
        [disabled]="currentPage === 1"
        (click)="onPageChange(currentPage - 1)"
        [attr.aria-label]="'Go to previous page'">
        ‹ Previous
      </button>
      
      <div class="pagination-pages">
        @for (page of visiblePages(); track page) {
          <button 
            class="pagination-btn"
            [class.active]="page === currentPage"
            (click)="onPageChange(page)"
            [attr.aria-label]="'Go to page ' + page"
            [attr.aria-current]="page === currentPage ? 'page' : null">
            {{ page }}
          </button>
        }
      </div>
      
      <button 
        class="pagination-btn"
        [disabled]="currentPage === totalPages"
        (click)="onPageChange(currentPage + 1)"
        [attr.aria-label]="'Go to next page'">
        Next ›
      </button>
    </nav>
  `,
  styles: [`
    .pagination {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      justify-content: center;
      margin: 2rem 0;
    }
    .pagination-btn {
      padding: 0.5rem 1rem;
      border: 1px solid var(--border-color);
      background: var(--bg-color);
      color: var(--text-color);
      cursor: pointer;
      border-radius: 4px;
      transition: all 0.2s;
    }
    .pagination-btn:hover:not(:disabled) {
      background: var(--primary-color);
      color: white;
    }
    .pagination-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .pagination-btn.active {
      background: var(--primary-color);
      color: white;
    }
    .pagination-pages {
      display: flex;
      gap: 0.25rem;
    }
  `]
})
export class PaginationComponent {
  @Input() currentPage = 1;
  @Input() totalPages = 1;
  @Input() maxVisible = 5;
  @Output() pageChange = new EventEmitter<number>();

  visiblePages = computed(() => {
    const pages: number[] = [];
    const start = Math.max(1, this.currentPage - Math.floor(this.maxVisible / 2));
    const end = Math.min(this.totalPages, start + this.maxVisible - 1);
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  });

  onPageChange(page: number) {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.pageChange.emit(page);
    }
  }
}