# Social Login Implementation - Token-Based Callback

This document explains the updated social login implementation that handles token-based OAuth callbacks.

## Current Implementation

The social login integration has been updated to handle your backend's token-based callback approach where tokens are passed as URL parameters.

### Callback URL Format

Your backend redirects to:

```
http://localhost:5173/auth/callback?access_token=JWT_TOKEN&refresh_token=REFRESH_TOKEN&user_id=USER_ID
```

### What's Been Implemented

1. **Updated AuthCallback Component** - Now handles token-based callbacks
2. **Enhanced AuthContext** - Added `handleSocialLoginWithTokens` method
3. **Token Processing** - Extracts tokens from URL parameters and processes authentication
4. **User Profile Fetching** - Automatically fetches user profile using the access token
5. **Error Handling** - Comprehensive error handling for OAuth failures

## How It Works

### 1. User Clicks Social Login Button

- User clicks "Google" or "Facebook" button on login page
- `SocialLoginButton` component redirects to your backend OAuth endpoint
- Backend handles OAuth flow with the provider

### 2. Backend OAuth Processing

- Backend exchanges OAuth code for access token
- Backend creates/updates user in database
- Backend generates JWT tokens
- Backend redirects to frontend with tokens as URL parameters

### 3. Frontend Token Processing

- `AuthCallback` component extracts tokens from URL
- Stores tokens securely in local storage
- Fetches user profile using access token
- Updates authentication context
- Redirects user to appropriate dashboard

## Backend Requirements

Your backend needs to implement:

### 1. OAuth Initiation Endpoints

```
GET /auth/google
GET /auth/facebook
```

These should redirect users to the respective OAuth providers.

### 2. OAuth Callback Processing

After successful OAuth authentication, redirect to:

```
http://localhost:5173/auth/callback?access_token=JWT_ACCESS_TOKEN&refresh_token=JWT_REFRESH_TOKEN&user_id=USER_ID
```

### 3. User Profile Endpoint

```
GET /users/profile
```

This should return user profile data when called with a valid access token.

**Response:**

```json
{
  "success": true,
  "data": {
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
  }
}
```

## Error Handling

### OAuth Errors

If OAuth authentication fails, redirect with error parameters:

```
http://localhost:5173/auth/callback?error=access_denied&error_description=User%20denied%20access
```

### Common Error Types

- `access_denied` - User denied access to the application
- `invalid_request` - Invalid request parameters
- `server_error` - Server error during authentication

## Testing the Implementation

### 1. Test the Callback URL

You can test the callback with your actual tokens:

```
http://localhost:5173/auth/callback?access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODk3YzIyYmU2MDkwMDUyODMxZjY1ZjEiLCJlbWFpbCI6Im1vbmVlYmJoYXR0aTk4N0BnbWFpbC5jb20iLCJyb2xlIjoidGVhY2hlciIsImlhdCI6MTc1NzIyNTY0MiwiZXhwIjoxNzU3MjI5MjQyfQ.EX7FX1WIUjlHpumP8vZ_YErnmQD0nuQm27agM1Q025E&refresh_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODk3YzIyYmU2MDkwMDUyODMxZjY1ZjEiLCJlbWFpbCI6Im1vbmVlYmJoYXR0aTk4N0BnbWFpbC5jb20iLCJyb2xlIjoidGVhY2hlciIsImlhdCI6MTc1NzIyNTY0MiwiZXhwIjoxNzU3ODMwNDQyfQ.nOoTesZ8hwLhsXXDchSSvFnYQnySFNd_bYSPr96nMlo&user_id=6897c22be6090052831f65f1
```

### 2. Expected Behavior

1. **Loading State** - Shows loading spinner while processing
2. **Success State** - Shows success message and redirects to dashboard
3. **Error State** - Shows error message with retry options

### 3. Navigation Flow

- If user profile is not complete → `/profile-completion`
- If user is fully set up → `/dashboard/teacher` (or appropriate role)

**Note:** Email verification is skipped for social login since OAuth providers (Google/Facebook) already verify user emails.

## Environment Variables

Make sure you have:

```env
VITE_API_BASE_URL=http://localhost:5000
```

## Security Considerations

1. **Token Storage** - Tokens are stored securely using your existing storage helpers
2. **Token Validation** - Access tokens are validated before use
3. **Error Messages** - Sensitive information is not exposed in error messages
4. **HTTPS** - Required for production OAuth flows

## Troubleshooting

### Common Issues

1. **Missing Tokens**

   - Ensure backend is passing all required parameters
   - Check URL encoding of tokens

2. **Profile Fetch Failure**

   - Verify `/users/profile` endpoint is working
   - Check access token validity
   - Ensure proper CORS configuration

3. **Navigation Issues**
   - Check user state (email verification, profile completion)
   - Verify role-based routing

### Debug Mode

Enable debug logging by checking browser console for detailed error messages.

## Files Modified

- ✅ `src/components/AuthCallback.tsx` - Updated to handle token-based callbacks
- ✅ `src/contexts/AuthContext.tsx` - Added `handleSocialLoginWithTokens` method
- ✅ `src/apis/auth.ts` - Added social login API functions
- ✅ `src/components/SocialLoginButton.tsx` - Reusable social login button
- ✅ `src/pages/SignIn.tsx` - Updated to use new social login buttons
- ✅ `src/App.tsx` - Added OAuth callback route

## Next Steps

1. **Test the Integration** - Use the callback URL with your tokens
2. **Verify Backend** - Ensure your backend is generating proper tokens
3. **Test User Flow** - Verify navigation works correctly
4. **Production Setup** - Configure OAuth providers for production

The integration is now ready to work with your token-based OAuth callback approach! 🎉
