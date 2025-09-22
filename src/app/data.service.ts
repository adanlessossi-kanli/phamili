import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private themeSignal = signal('light');
  theme = this.themeSignal.asReadonly();

  toggleTheme() {
    this.themeSignal.set(this.theme() === 'light' ? 'dark' : 'light');
    document.body.className = this.theme() + '-theme';
  }

  getBlogPosts(page = 1, limit = 5) {
    const allPosts = [
      { id: 1, title: 'Getting Started with Angular', date: '2024-01-15', excerpt: 'Learn the basics of Angular development and modern web practices.', content: 'Full content here...' },
      { id: 2, title: 'Modern Web Development', date: '2024-01-10', excerpt: 'Exploring the latest trends in web development and best practices.', content: 'Full content here...' },
      { id: 3, title: 'TypeScript Best Practices', date: '2024-01-05', excerpt: 'Essential TypeScript patterns for better code quality.', content: 'Full content here...' },
      { id: 4, title: 'Responsive Design Tips', date: '2024-01-01', excerpt: 'Creating beautiful responsive layouts for all devices.', content: 'Full content here...' }
    ];
    const start = (page - 1) * limit;
    return {
      posts: allPosts.slice(start, start + limit),
      total: allPosts.length,
      hasMore: start + limit < allPosts.length
    };
  }

  getMediaItems() {
    return [
      { id: 1, title: 'Nature Photography', type: '🖼️', category: 'photo' },
      { id: 2, title: 'Product Demo Video', type: '🎥', category: 'video' },
      { id: 3, title: 'Landscape Collection', type: '🖼️', category: 'photo' },
      { id: 4, title: 'Podcast Episode 1', type: '🎵', category: 'audio' },
      { id: 5, title: 'Tutorial Series', type: '🎥', category: 'video' },
      { id: 6, title: 'Music Composition', type: '🎵', category: 'audio' }
    ];
  }
}