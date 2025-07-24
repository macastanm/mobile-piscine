# Diary App

A modern diary application built with React Native, Expo, and Firebase Authentication.

## 🚀 Quick Start

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Check configuration:**

   ```bash
   npm run check-config
   ```

3. **Configure authentication** (see [Authentication Setup](#authentication-setup) below)

4. **Start the app:**
   ```bash
   npm start
   ```

## 🔧 Authentication Setup

### Prerequisites

- Firebase project
- Google Cloud Console access
- GitHub account (for OAuth app setup)

### Step 1: Firebase Project Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Enable Authentication:
   - Go to Authentication > Sign-in method
   - Enable Google provider
   - Enable GitHub provider

### Step 2: Firebase Configuration

1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps" section
3. Add a new app (Web app)
4. Copy the configuration object
5. Update `config/env.ts` with your Firebase config

### Step 3: Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your Firebase project
3. Go to APIs & Services > Credentials
4. Create OAuth 2.0 Client ID:
   - Application type: Web application
   - Authorized redirect URIs: Add your Firebase auth domain
5. Copy the Client ID
6. Update `config/env.ts` with your Google Client ID

### Step 4: GitHub OAuth Setup

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in the details:
   - Application name: Your Diary App
   - Homepage URL: Your app URL
   - Authorization callback URL: `https://your-project-id.firebaseapp.com/__/auth/handler`
4. Copy the Client ID and Client Secret
5. Update `config/env.ts` with your GitHub credentials

## 🐛 Troubleshooting

### Common Errors

#### "Cannot read property 'authorizationEndpoint' of undefined"

This error occurs when the Google OAuth configuration is missing or incorrect.

**Solution:**

1. Ensure you have configured your Google Client ID in `config/env.ts`
2. Run `npm run check-config` to verify all required fields are set
3. Follow the [Authentication Setup](#authentication-setup) guide above

#### "Invalid client" error

This means your OAuth client IDs are incorrect or not properly configured.

**Solution:**

1. Double-check your OAuth client IDs in `config/env.ts`
2. Verify your OAuth apps are properly configured in Google Cloud Console and GitHub
3. Ensure redirect URIs match exactly

#### "Redirect URI mismatch"

The redirect URI in your OAuth app doesn't match what the app is using.

**Solution:**

1. Check your OAuth app configuration
2. Ensure the redirect URI matches your Firebase auth domain
3. For Google: Use `https://your-project-id.firebaseapp.com/__/auth/handler`
4. For GitHub: Use `https://your-project-id.firebaseapp.com/__/auth/handler`

### Configuration Validation

Run the configuration checker to see what needs to be set up:

```bash
npm run check-config
```

This will show you exactly which fields are missing or still using placeholder values.

## 📱 Features

- ✅ Google OAuth Authentication
- ✅ GitHub OAuth Authentication
- ✅ Persistent user sessions
- ✅ Modern UI with dark/light theme support
- ✅ User profile management
- ✅ Secure token handling

## 🛠️ Development

### Available Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Start on Android device/emulator
- `npm run ios` - Start on iOS device/simulator
- `npm run web` - Start in web browser
- `npm run check-config` - Check authentication configuration
- `npm run reset-project` - Reset the project to initial state

### Project Structure

```
diary_app/
├── app/                    # Expo Router pages
├── components/             # Reusable UI components
├── config/                 # Configuration files
├── constants/              # App constants
├── hooks/                  # Custom React hooks
├── services/               # Business logic services
└── scripts/                # Utility scripts
```

## 🔒 Security

- All OAuth credentials are stored in environment configuration
- Firebase handles secure token management
- No sensitive data is logged or stored in plain text
- Proper error handling prevents information leakage

## 📄 License

This project is part of the mobile piscine curriculum.

## 🤝 Contributing

This is a learning project. Feel free to experiment and improve the code!
