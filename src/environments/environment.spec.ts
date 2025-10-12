import { environment } from './environment';

describe('Environment', () => {
  it('should have development configuration', () => {
    expect(environment.production).toBe(false);
    expect(environment.enableAnalytics).toBe(false);
    expect(environment.enableErrorTracking).toBe(false);
    expect(environment.apiUrl).toBe('http://localhost:3000/api');
  });

  it('should have cognito configuration', () => {
    expect(environment.cognito).toBeDefined();
    expect(environment.cognito.region).toBeDefined();
    expect(environment.cognito.userPoolId).toBeDefined();
    expect(environment.cognito.userPoolWebClientId).toBeDefined();
  });
});