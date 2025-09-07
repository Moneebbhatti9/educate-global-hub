# Social Login Integration Setup

This document explains how to set up and use the Google and Facebook social login functionality that has been integrated into your Educate Global Hub application.

## What's Been Implemented

### 1. API Integration

- Added social login endpoints to `src/apis/auth.ts`
- Added `initiateGoogleAuth()` and `initiateFacebookAuth()` functions
- Added `handleSocialCallback()` for processing OAuth callbacks
- Added React Query hooks for social login

### 2. Components Created

- **SocialLoginButton** (`src/components/SocialLoginButton.tsx`): Reusable button component for social login
- **AuthCallback** (`src/components/AuthCallback.tsx`): Handles OAuth redirect callbacks

### 3. Context Updates

- Updated `AuthContext` to include social login methods
- Added `initiateGoogleAuth()`, `initiateFacebookAuth()`, and `handleSocialLogin()` methods

### 4. UI Integration

- Updated SignIn page to use the new SocialLoginButton components
- Added `/auth/callback` route to handle OAuth redirects

## Backend Requirements

Your backend needs to implement the following endpoints:

### 1. OAuth Initiation Endpoints

```
GET /auth/google
GET /auth/facebook
```

These should redirect users to the respective OAuth providers.

### 2. OAuth Callback Endpoint

```
POST /auth/social/callback
```

This should handle the OAuth callback and return user data with tokens.

**Request Body:**

```json
{
  "provider": "google" | "facebook",
  "code": "authorization_code_from_oauth_provider",
  "state": "optional_state_parameter"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "teacher",
      "isEmailVerified": true,
      "isProfileComplete": false,
      "avatarUrl": "optional_avatar_url",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    },
    "accessToken": "jwt_access_token",
    "refreshToken": "jwt_refresh_token"
  }
}
```

## Environment Variables

Add these to your `.env` file:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:5000

# For production, update to your production API URL
# VITE_API_BASE_URL=https://your-api-domain.com
```

## OAuth Provider Configuration

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - Development: `http://localhost:3000/auth/callback`
   - Production: `https://yourdomain.com/auth/callback`

### Facebook OAuth Setup

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app
3. Add Facebook Login product
4. Configure OAuth redirect URIs:
   - Development: `http://localhost:3000/auth/callback`
   - Production: `https://yourdomain.com/auth/callback`

## How It Works

### 1. User Clicks Social Login Button

- User clicks "Google" or "Facebook" button on login page
- `SocialLoginButton` component calls the appropriate auth API
- User is redirected to OAuth provider

### 2. OAuth Provider Authentication

- User authenticates with Google/Facebook
- OAuth provider redirects back to your backend with authorization code

### 3. Backend Processing

- Backend exchanges authorization code for access token
- Backend fetches user profile from OAuth provider
- Backend creates/updates user in database
- Backend generates JWT tokens

### 4. Frontend Callback Handling

- OAuth provider redirects to `/auth/callback` with tokens
- `AuthCallback` component processes the callback
- User data and tokens are stored
- User is redirected to profile completion or dashboard (email verification is skipped for social login)

## Testing the Integration

### 1. Start Your Backend

Make sure your backend is running with the social login endpoints implemented.

### 2. Start Your Frontend

```bash
npm run dev
```

### 3. Test Social Login

1. Go to `/login` page
2. Click "Google" or "Facebook" button
3. Complete OAuth flow
4. Verify you're redirected to the correct dashboard

## Error Handling

The integration includes comprehensive error handling:

- **OAuth Errors**: Access denied, invalid request, server errors
- **Network Errors**: Connection issues, timeouts
- **Backend Errors**: Invalid responses, missing data
- **User State Errors**: Profile completion requirements

## Security Considerations

1. **HTTPS Required**: OAuth providers require HTTPS in production
2. **State Parameter**: Use state parameter to prevent CSRF attacks
3. **Token Storage**: Tokens are stored securely using your existing storage helpers
4. **Error Messages**: Don't expose sensitive information in error messages

## Customization

### Styling

The `SocialLoginButton` component uses your existing UI components and can be styled by:

- Modifying the `className` prop
- Updating the button variants
- Customizing the icons

### Additional Providers

To add more OAuth providers:

1. Add new endpoints to `authAPI`
2. Update the `SocialLoginButton` component
3. Add provider-specific icons and styling
4. Update the `AuthCallback` component

## Troubleshooting

### Common Issues

1. **Redirect URI Mismatch**

   - Ensure OAuth provider settings match your callback URL
   - Check for trailing slashes and protocol (http vs https)

2. **CORS Issues**

   - Configure your backend to allow requests from your frontend domain
   - Check CORS headers in your API responses

3. **Token Issues**

   - Verify JWT token generation in backend
   - Check token expiration settings
   - Ensure proper token storage and retrieval

4. **User Profile Issues**
   - Verify user data mapping from OAuth provider
   - Check required fields for profile completion
   - Ensure proper role assignment

### Debug Mode

Enable debug logging by setting `NODE_ENV=development` to see detailed logs in the browser console.

## Production Deployment

1. Update `VITE_API_BASE_URL` to your production API URL
2. Configure OAuth providers with production URLs
3. Ensure HTTPS is enabled
4. Test the complete flow in production environment
5. Monitor logs for any issues

## Support

If you encounter issues:

1. Check browser console for errors
2. Verify backend logs
3. Test OAuth provider configuration
4. Ensure all environment variables are set correctly
