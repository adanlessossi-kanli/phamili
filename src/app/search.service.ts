import { Injectable, signal } from '@angular/core';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private searchQuery = signal('');
  searchQuery$ = this.searchQuery.asReadonly();

  constructor(private dataService: DataService) {}

  search(query: string) {
    this.searchQuery.set(query.toLowerCase());
    return this.performSearch(query);
  }

  private performSearch(query: string) {
    if (!query.trim()) return { posts: [], media: [] };

    const posts = this.dataService.getBlogPosts(1, 10).posts.filter(post =>
      post.title.toLowerCase().includes(query.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(query.toLowerCase())
    );

    const media = this.dataService.getMediaItems().filter(item =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
    );

    return { posts, media };
  }

  clearSearch() {
    this.searchQuery.set('');
  }
}