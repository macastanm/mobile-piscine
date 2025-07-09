# Authentication Setup Guide

This guide will help you set up Firebase Authentication with Google and GitHub OAuth providers for your diary app.

## Prerequisites

- A Firebase project
- Google Cloud Console access
- GitHub account (for OAuth app setup)

## Step 1: Firebase Project Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Enable Authentication:
   - Go to Authentication > Sign-in method
   - Enable Google provider
   - Enable GitHub provider

## Step 2: Firebase Configuration

1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps" section
3. Add a new app (Web app)
4. Copy the configuration object
5. Replace the placeholder values in `config/firebase.ts`:

```typescript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id",
};
```

## Step 3: Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your Firebase project
3. Go to APIs & Services > Credentials
4. Create OAuth 2.0 Client ID:
   - Application type: Web application
   - Authorized redirect URIs: Add your Firebase auth domain
5. Copy the Client ID
6. Update `services/authService.ts`:

```typescript
const googleConfig = {
  clientId: "your-actual-google-client-id.apps.googleusercontent.com",
  scopes: ["openid", "profile", "email"],
};
```

## Step 4: GitHub OAuth Setup

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in the details:
   - Application name: Your Diary App
   - Homepage URL: Your app URL
   - Authorization callback URL: `https://your-project-id.firebaseapp.com/__/auth/handler`
4. Copy the Client ID and Client Secret
5. Update `services/authService.ts`:

```typescript
const githubConfig = {
  clientId: 'your-actual-github-client-id',
  scopes: ['read:user', 'user:email'],
};

// In the signInWithGitHub method, update:
clientSecret: 'your-actual-github-client-secret',
```

## Step 5: Firebase Authentication Rules

In Firebase Console > Authentication > Sign-in method:

### Google Provider:

- Enable Google sign-in
- Add your authorized domains

### GitHub Provider:

- Enable GitHub sign-in
- Add your GitHub OAuth app Client ID and Client Secret

## Step 6: Testing

1. Run your app: `npm start`
2. Navigate to the login screen
3. Click "Sign In"
4. Choose Google or GitHub
5. Complete the OAuth flow

## Troubleshooting

### Common Issues:

1. **"Invalid client" error**: Check that your OAuth client IDs are correct
2. **"Redirect URI mismatch"**: Ensure redirect URIs match exactly
3. **"Network error"**: Check your internet connection and Firebase project settings

### Debug Tips:

- Check the console for detailed error messages
- Verify all configuration values are correct
- Ensure your Firebase project has billing enabled (required for external auth providers)

## Security Notes

- Never commit your actual API keys to version control
- Use environment variables for production
- Regularly rotate your OAuth client secrets
- Monitor your Firebase Authentication usage

## Next Steps

After successful authentication setup:

1. Implement user profile management
2. Add data persistence for diary entries
3. Set up proper security rules in Firestore
4. Add email verification if needed
