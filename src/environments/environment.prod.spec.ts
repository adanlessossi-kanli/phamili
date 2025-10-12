import { environment } from './environment.prod';

describe('Production Environment', () => {
  it('should have production configuration', () => {
    expect(environment.production).toBe(true);
    expect(environment.enableAnalytics).toBe(true);
    expect(environment.enableErrorTracking).toBe(true);
    expect(environment.apiUrl).toBe('https://api.phamili.com');
  });

  it('should have cognito configuration', () => {
    expect(environment.cognito).toBeDefined();
    expect(environment.cognito.region).toBeDefined();
    expect(environment.cognito.userPoolId).toBeDefined();
    expect(environment.cognito.userPoolWebClientId).toBeDefined();
  });
});