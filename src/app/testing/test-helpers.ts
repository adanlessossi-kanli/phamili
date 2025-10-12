import { signal } from '@angular/core';

export class TestHelpers {
  static createMockSignal<T>(initialValue: T) {
    return signal(initialValue);
  }

  static createMockAuthService(isAuthenticated = false, user: any = null) {
    return jasmine.createSpyObj('AuthService', 
      ['login', 'logout', 'checkAuth', 'register', 'confirmRegistration', 'forgotPassword'],
      {
        isAuthenticated$: signal(isAuthenticated),
        user$: signal(user)
      }
    );
  }

  static createMockNotificationService() {
    return jasmine.createSpyObj('NotificationService', 
      ['success', 'error', 'info', 'warning']
    );
  }

  static createMockRouter() {
    return jasmine.createSpyObj('Router', ['navigate', 'navigateByUrl']);
  }

  static createMockDataService() {
    return jasmine.createSpyObj('DataService', 
      ['getBlogPosts', 'getMediaItems', 'toggleTheme'],
      {
        theme: signal('light')
      }
    );
  }

  static createMockPwaService(canInstall = false) {
    return jasmine.createSpyObj('PwaService', ['installApp'], {
      canInstall: signal(canInstall)
    });
  }

  static createMockStateService() {
    return jasmine.createSpyObj('StateService', 
      ['setUser', 'setTheme', 'setLoading', 'setPosts', 'addPosts', 'setMedia'],
      {
        user: signal(null),
        theme: signal('light'),
        loading: signal(false),
        posts: signal([]),
        media: signal([])
      }
    );
  }
}