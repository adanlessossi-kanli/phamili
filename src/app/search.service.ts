import { Injectable, signal } from '@angular/core';
import { DataService } from './data.service';
import { Subject, debounceTime, distinctUntilChanged, switchMap, of } from 'rxjs';

export interface SearchResult {
  id: string;
  title: string;
  content: string;
  type: 'blog' | 'media';
  score: number;
}

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private searchQuery = signal('');
  private searchResults = signal<SearchResult[]>([]);
  private isSearching = signal(false);
  private searchSubject = new Subject<string>();

  searchQuery$ = this.searchQuery.asReadonly();
  searchResults$ = this.searchResults.asReadonly();
  isSearching$ = this.isSearching.asReadonly();

  constructor(private dataService: DataService) {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(query => this.performSearch(query))
    ).subscribe(results => {
      this.searchResults.set(results);
      this.isSearching.set(false);
    });
  }

  search(query: string) {
    this.searchQuery.set(query.toLowerCase());
    if (!query.trim()) {
      this.searchResults.set([]);
      this.isSearching.set(false);
      return;
    }
    this.isSearching.set(true);
    this.searchSubject.next(query);
  }

  private performSearch(query: string) {
    if (!query.trim()) return of([]);

    const posts = this.dataService.getBlogPosts(1, 50).posts
      .filter(post =>
        (post.title?.toLowerCase() || '').includes(query.toLowerCase()) ||
        (post.excerpt?.toLowerCase() || '').includes(query.toLowerCase())
      )
      .map(post => ({
        id: post.id?.toString() || '',
        title: post.title || '',
        content: post.excerpt || '',
        type: 'blog' as const,
        score: this.calculateScore(query, (post.title || '') + ' ' + (post.excerpt || ''))
      }));

    const media = this.dataService.getMediaItems()
      .filter(item =>
        (item.title?.toLowerCase() || '').includes(query.toLowerCase()) ||
        (item.category?.toLowerCase() || '').includes(query.toLowerCase())
      )
      .map(item => ({
        id: item.id?.toString() || '',
        title: item.title || '',
        content: item.category || '',
        type: 'media' as const,
        score: this.calculateScore(query, (item.title || '') + ' ' + (item.category || ''))
      }));

    const results = [...posts, ...media]
      .sort((a, b) => b.score - a.score)
      .slice(0, 20);

    return of(results);
  }

  private calculateScore(query: string, text: string): number {
    const lowerQuery = query.toLowerCase();
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes(lowerQuery)) {
      const index = lowerText.indexOf(lowerQuery);
      return 1 - (index / lowerText.length);
    }
    
    const words = lowerQuery.split(' ');
    const matches = words.filter(word => lowerText.includes(word)).length;
    return matches / words.length * 0.5;
  }

  clearSearch() {
    this.searchQuery.set('');
    this.searchResults.set([]);
    this.isSearching.set(false);
  }
}