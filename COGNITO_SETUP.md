# Amazon Cognito Setup Guide

## Prerequisites
- AWS Account
- AWS CLI configured (optional)

## Manual Setup

### Step 1: Create Cognito User Pool

1. Go to AWS Console > Amazon Cognito
2. Click "Create user pool"
3. Configure sign-in options:
   - Email address
   - Username (optional)
4. Configure security requirements:
   - Password policy: Default or custom
   - MFA: Optional (recommended for production)
5. Configure sign-up experience:
   - Enable self-registration
   - Required attributes: email, name
6. Configure message delivery:
   - Email provider: Cognito default or SES
7. Integrate your app:
   - User pool name: `phamili-users`
   - App client name: `phamili-web-client`
   - Don't generate client secret (for web apps)

### Step 2: Configure App Client

1. In your User Pool, go to "App integration"
2. Create app client:
   - App type: Public client
   - App client name: `phamili-web-client`
   - Authentication flows: 
     - ALLOW_USER_PASSWORD_AUTH
     - ALLOW_REFRESH_TOKEN_AUTH
3. Note down:
   - User Pool ID (e.g., us-east-1_XXXXXXXXX)
   - App Client ID (e.g., XXXXXXXXXXXXXXXXXXXXXXXXXX)

### Step 4: Test Authentication

1. Start the application:
```bash
ng serve
```

2. Navigate to `/login`
3. Register a new user
4. Check your email for verification code
5. Confirm registration and login

## Authentication Options

### Custom UI (Current Implementation)
- Navigate to `/login` for custom authentication UI
- Full control over design and user experience
- Integrated with app theme and notifications

## Optional: Advanced Configuration

### Enable OAuth (Social Login)
1. In User Pool > App integration > Domain
2. Create Cognito domain or use custom domain
3. Configure OAuth 2.0 settings
4. Add identity providers (Google, Facebook, etc.)

### Enable Identity Pool (for AWS resource access)
1. Create Cognito Identity Pool
2. Link to User Pool
3. Configure IAM roles for authenticated/unauthenticated users

## Security Best Practices

1. **Enable MFA** for production
2. **Use HTTPS** in production
3. **Configure CORS** properly
4. **Set up CloudWatch** logging
5. **Use AWS WAF** for additional protection
6. **Regular security audits**

## Troubleshooting

### Common Issues:
- **Invalid credentials**: Check User Pool ID and Client ID
- **User not confirmed**: Check email verification
- **CORS errors**: Configure allowed origins in Cognito
- **Token expired**: Implement token refresh logic

### Useful AWS CLI Commands:
```bash
# List User Pools
aws cognito-idp list-user-pools --max-items 10

# Describe User Pool
aws cognito-idp describe-user-pool --user-pool-id us-east-1_XXXXXXXXX

# List users
aws cognito-idp list-users --user-pool-id us-east-1_XXXXXXXXX
```
