import { getCognitoConfig } from './amplify.config';
import { environment } from '../environments/environment';

describe('getCognitoConfig', () => {
  it('should return correct Cognito configuration', () => {
    const config = getCognitoConfig();
    
    expect(config).toEqual({
      region: environment.cognito.region,
      userPoolId: environment.cognito.userPoolId,
      userPoolClientId: environment.cognito.userPoolWebClientId
    });
  });

  it('should use environment variables', () => {
    const config = getCognitoConfig();
    
    expect(config.region).toBe(environment.cognito.region);
    expect(config.userPoolId).toBe(environment.cognito.userPoolId);
    expect(config.userPoolClientId).toBe(environment.cognito.userPoolWebClientId);
  });
});