import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from './data.service';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page">
      <div class="page-header">
        <h1>Blog</h1>
        <div class="breadcrumb">Home > Blog</div>
      </div>
      <div class="loading" *ngIf="loading()">Loading posts...</div>
      <div class="posts" *ngIf="!loading()">
        <article *ngFor="let post of posts()" class="post" (click)="selectPost(post)">
          <h3>{{post.title}}</h3>
          <p class="date">{{post.date}}</p>
          <p>{{post.excerpt}}</p>
        </article>
      </div>
      <div class="pagination" *ngIf="!loading()">
        <button (click)="prevPage()" [disabled]="currentPage() === 1">Previous</button>
        <span>Page {{currentPage()}}</span>
        <button (click)="nextPage()" [disabled]="!hasMore()">Next</button>
      </div>
    </div>
  `,
  styles: [`
    .page { padding: 20px; }
    .page-header { margin-bottom: 30px; }
    h1 { color: #2c3e50; margin-bottom: 10px; }
    .breadcrumb { color: #95a5a6; font-size: 0.9rem; }
    .loading { text-align: center; padding: 40px; color: #95a5a6; }
    .post { background: white; padding: 20px; margin-bottom: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); cursor: pointer; transition: transform 0.2s; }
    .post:hover { transform: translateY(-2px); box-shadow: 0 4px 8px rgba(0,0,0,0.15); }
    .post h3 { color: #2c3e50; margin-bottom: 10px; }
    .date { color: #95a5a6; font-size: 0.9rem; margin-bottom: 15px; }
    .pagination { display: flex; justify-content: center; align-items: center; gap: 20px; margin-top: 30px; }
    .pagination button { padding: 10px 20px; border: 1px solid #ddd; background: white; border-radius: 4px; cursor: pointer; }
    .pagination button:disabled { opacity: 0.5; cursor: not-allowed; }
  `]
})
export class BlogComponent implements OnInit {
  private dataService = inject(DataService);
  posts = signal<any[]>([]);
  loading = signal(true);
  currentPage = signal(1);
  hasMore = signal(false);

  ngOnInit() {
    this.loadPosts();
  }

  loadPosts() {
    this.loading.set(true);
    setTimeout(() => {
      const result = this.dataService.getBlogPosts(this.currentPage());
      this.posts.set(result.posts);
      this.hasMore.set(result.hasMore);
      this.loading.set(false);
    }, 500);
  }

  nextPage() {
    if (this.hasMore()) {
      this.currentPage.update(p => p + 1);
      this.loadPosts();
    }
  }

  prevPage() {
    if (this.currentPage() > 1) {
      this.currentPage.update(p => p - 1);
      this.loadPosts();
    }
  }

  selectPost(post: any) {
    console.log('Selected post:', post);
  }
}