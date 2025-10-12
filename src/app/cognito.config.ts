export const cognitoConfig = {
  region: 'us-east-1',
  userPoolId: 'us-east-1_XXXXXXXXX', // Replace with your User Pool ID
  clientId: 'XXXXXXXXXXXXXXXXXXXXXXXXXX', // Replace with your App Client ID
  identityPoolId: 'us-east-1:XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX', // Optional: for federated identities
  
  // Optional: OAuth configuration
  oauth: {
    domain: 'your-domain.auth.us-east-1.amazoncognito.com',
    scope: ['email', 'openid', 'profile'],
    redirectSignIn: 'http://localhost:4200/',
    redirectSignOut: 'http://localhost:4200/',
    responseType: 'code'
  }
};

// Environment-specific configuration
export const getCognitoConfig = () => {
  const isProduction = window.location.hostname !== 'localhost';
  
  return {
    ...cognitoConfig,
    oauth: {
      ...cognitoConfig.oauth,
      redirectSignIn: isProduction ? 'https://your-domain.com/' : 'http://localhost:4200/',
      redirectSignOut: isProduction ? 'https://your-domain.com/' : 'http://localhost:4200/'
    }
  };
};