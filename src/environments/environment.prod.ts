export const environment = {
  production: true,
  staging: false,
  apiUrl: 'https://api.phamili.com',
  enableAnalytics: true,
  enableErrorTracking: true,
  cognito: {
    region: 'us-east-1',
    userPoolId: 'your-prod-user-pool-id',
    userPoolWebClientId: 'your-prod-client-id'
  },
  analytics: {
    enabled: true,
    trackingId: 'GA-PROD-456'
  },
  logging: {
    level: 'error',
    remoteLogging: true
  },
  features: {
    enablePWA: true,
    enableOfflineMode: true,
    enableAnalytics: true
  }
};