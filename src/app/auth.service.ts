import { Injectable, signal } from '@angular/core';
import { 
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  SignUpCommand,
  ConfirmSignUpCommand,
  ForgotPasswordCommand,
  GlobalSignOutCommand,
  GetUserCommand
} from '@aws-sdk/client-cognito-identity-provider';
import { environment } from '../environments/environment';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser = signal<User | null>(null);
  private isAuthenticated = signal(false);
  private cognitoClient: CognitoIdentityProviderClient;
  private accessToken: string | null = null;

  user$ = this.currentUser.asReadonly();
  isAuthenticated$ = this.isAuthenticated.asReadonly();

  constructor() {
    this.cognitoClient = new CognitoIdentityProviderClient({
      region: environment.cognito.region
    });
  }

  async login(email: string, password: string): Promise<boolean> {
    try {
      const command = new InitiateAuthCommand({
        AuthFlow: 'USER_PASSWORD_AUTH',
        ClientId: environment.cognito.userPoolWebClientId,
        AuthParameters: {
          USERNAME: email,
          PASSWORD: password
        }
      });
      
      const response = await this.cognitoClient.send(command);
      
      if (response.AuthenticationResult?.AccessToken) {
        this.accessToken = response.AuthenticationResult.AccessToken;
        localStorage.setItem('accessToken', this.accessToken);
        await this.updateUserState();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  }

  async logout() {
    try {
      if (this.accessToken) {
        const command = new GlobalSignOutCommand({
          AccessToken: this.accessToken
        });
        await this.cognitoClient.send(command);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.accessToken = null;
      localStorage.removeItem('accessToken');
      this.currentUser.set(null);
      this.isAuthenticated.set(false);
    }
  }

  async checkAuth() {
    try {
      const token = localStorage.getItem('accessToken');
      if (token) {
        this.accessToken = token;
        await this.updateUserState();
      }
    } catch (error) {
      this.currentUser.set(null);
      this.isAuthenticated.set(false);
    }
  }

  async register(name: string, email: string, password: string): Promise<boolean> {
    try {
      const command = new SignUpCommand({
        ClientId: environment.cognito.userPoolWebClientId,
        Username: email,
        Password: password,
        UserAttributes: [
          { Name: 'email', Value: email },
          { Name: 'name', Value: name }
        ]
      });
      
      await this.cognitoClient.send(command);
      return true; // Always needs confirmation
    } catch (error) {
      console.error('Registration failed:', error);
      return false;
    }
  }

  async confirmRegistration(email: string, code: string): Promise<boolean> {
    try {
      const command = new ConfirmSignUpCommand({
        ClientId: environment.cognito.userPoolWebClientId,
        Username: email,
        ConfirmationCode: code
      });
      
      await this.cognitoClient.send(command);
      return true;
    } catch (error) {
      console.error('Confirmation failed:', error);
      return false;
    }
  }

  async forgotPassword(email: string): Promise<boolean> {
    try {
      const command = new ForgotPasswordCommand({
        ClientId: environment.cognito.userPoolWebClientId,
        Username: email
      });
      
      await this.cognitoClient.send(command);
      return true;
    } catch (error) {
      console.error('Forgot password failed:', error);
      return false;
    }
  }

  private async updateUserState() {
    try {
      if (!this.accessToken) return;
      
      const command = new GetUserCommand({
        AccessToken: this.accessToken
      });
      
      const response = await this.cognitoClient.send(command);
      
      const user: User = {
        id: response.Username || '',
        name: response.UserAttributes?.find((attr: any) => attr.Name === 'name')?.Value || '',
        email: response.UserAttributes?.find((attr: any) => attr.Name === 'email')?.Value || '',
        avatar: '👤'
      };
      
      this.currentUser.set(user);
      this.isAuthenticated.set(true);
    } catch (error) {
      console.error('Failed to update user state:', error);
      this.logout();
    }
  }
}