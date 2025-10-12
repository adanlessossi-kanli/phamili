export const environment = {
  production: false,
  staging: true,
  apiUrl: 'https://staging-api.phamili.com',
  cognito: {
    region: 'us-east-1',
    userPoolId: 'us-east-1_STAGING123',
    userPoolWebClientId: 'staging456client789'
  },
  analytics: {
    enabled: true,
    trackingId: 'GA-STAGING-123'
  },
  logging: {
    level: 'info',
    remoteLogging: true
  },
  features: {
    enablePWA: true,
    enableOfflineMode: true,
    enableAnalytics: true
  }
};