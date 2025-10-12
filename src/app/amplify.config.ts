import { environment } from '../environments/environment';

export function getCognitoConfig() {
  return {
    region: environment.cognito.region,
    userPoolId: environment.cognito.userPoolId,
    userPoolClientId: environment.cognito.userPoolWebClientId
  };
}