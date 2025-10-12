import { Injectable, signal, computed } from '@angular/core';

export interface AppState {
  user: any;
  theme: 'light' | 'dark';
  loading: boolean;
  posts: any[];
  media: any[];
}

@Injectable({
  providedIn: 'root'
})
export class StateService {
  private state = signal<AppState>({
    user: null,
    theme: 'light',
    loading: false,
    posts: [],
    media: []
  });

  // Computed selectors
  user = computed(() => this.state().user);
  theme = computed(() => this.state().theme);
  loading = computed(() => this.state().loading);
  posts = computed(() => this.state().posts);
  media = computed(() => this.state().media);

  // Actions
  setUser(user: any) {
    this.state.update(s => ({ ...s, user }));
  }

  setTheme(theme: 'light' | 'dark') {
    this.state.update(s => ({ ...s, theme }));
    document.body.className = `${theme}-theme`;
  }

  setLoading(loading: boolean) {
    this.state.update(s => ({ ...s, loading }));
  }

  setPosts(posts: any[]) {
    this.state.update(s => ({ ...s, posts }));
  }

  addPosts(newPosts: any[]) {
    this.state.update(s => ({ ...s, posts: [...s.posts, ...newPosts] }));
  }

  setMedia(media: any[]) {
    this.state.update(s => ({ ...s, media }));
  }
}