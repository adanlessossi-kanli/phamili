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
      { id: 1, title: 'Getting Started with Angular', date: '2024-01-15', excerpt: 'Learn the basics of Angular development and modern web practices.', content: 'Full content here...', comments: [] },
      { id: 2, title: 'Modern Web Development', date: '2024-01-10', excerpt: 'Exploring the latest trends in web development and best practices.', content: 'Full content here...', comments: [] },
      { id: 3, title: 'TypeScript Best Practices', date: '2024-01-05', excerpt: 'Essential TypeScript patterns for better code quality.', content: 'Full content here...', comments: [] },
      { id: 4, title: 'Responsive Design Tips', date: '2024-01-01', excerpt: 'Creating beautiful responsive layouts for all devices.', content: 'Full content here...', comments: [] },
      { id: 5, title: 'Angular Signals Deep Dive', date: '2023-12-28', excerpt: 'Understanding Angular signals and reactive programming.', content: 'Full content here...', comments: [] },
      { id: 6, title: 'PWA Development Guide', date: '2023-12-25', excerpt: 'Building progressive web applications with Angular.', content: 'Full content here...', comments: [] },
      { id: 7, title: 'Performance Optimization', date: '2023-12-20', excerpt: 'Techniques for optimizing Angular application performance.', content: 'Full content here...', comments: [] },
      { id: 8, title: 'Testing Strategies', date: '2023-12-15', excerpt: 'Comprehensive testing approaches for Angular apps.', content: 'Full content here...', comments: [] }
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
      { id: 1, title: 'Nature Photography', type: '🖼️', category: 'photo', size: '2.5 MB', uploadDate: '2024-01-15' },
      { id: 2, title: 'Product Demo Video', type: '🎥', category: 'video', size: '15.2 MB', uploadDate: '2024-01-12' },
      { id: 3, title: 'Landscape Collection', type: '🖼️', category: 'photo', size: '4.1 MB', uploadDate: '2024-01-10' },
      { id: 4, title: 'Podcast Episode 1', type: '🎵', category: 'audio', size: '8.7 MB', uploadDate: '2024-01-08' },
      { id: 5, title: 'Tutorial Series', type: '🎥', category: 'video', size: '25.3 MB', uploadDate: '2024-01-05' },
      { id: 6, title: 'Music Composition', type: '🎵', category: 'audio', size: '6.2 MB', uploadDate: '2024-01-03' },
      { id: 7, title: 'Architecture Photos', type: '🖼️', category: 'photo', size: '3.8 MB', uploadDate: '2024-01-01' },
      { id: 8, title: 'Interview Recording', type: '🎵', category: 'audio', size: '12.1 MB', uploadDate: '2023-12-28' }
    ];
  }

  addComment(postId: number, comment: string, author: string) {
    // Simulate adding comment to post
    console.log(`Comment added to post ${postId}:`, { comment, author, timestamp: new Date() });
  }

  getAnalytics() {
    return {
      pageViews: 15420,
      uniqueVisitors: 8930,
      bounceRate: 32.5,
      avgSessionDuration: '2m 45s',
      topPages: [
        { page: '/home', views: 5420 },
        { page: '/blog', views: 3210 },
        { page: '/media', views: 2890 },
        { page: '/about', views: 1650 }
      ]
    };
  }
}