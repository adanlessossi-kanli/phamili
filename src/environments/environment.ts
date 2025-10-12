export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  enableAnalytics: false,
  enableErrorTracking: false,
  cognito: {
    region: 'us-east-1',
    userPoolId: 'your-dev-user-pool-id',
    userPoolWebClientId: 'your-dev-client-id'
  },
  features: {
    enablePWA: false,
    enableOfflineMode: true,
    enableAnalytics: false
  }
};