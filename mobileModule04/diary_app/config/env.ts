// Environment configuration for Firebase and OAuth
// Replace these values with your actual credentials

export const ENV = {
  // Firebase Configuration
  FIREBASE: {
    API_KEY: "your-api-key",
    AUTH_DOMAIN: "your-project-id.firebaseapp.com",
    PROJECT_ID: "your-project-id",
    STORAGE_BUCKET: "your-project-id.appspot.com",
    MESSAGING_SENDER_ID: "your-messaging-sender-id",
    APP_ID: "your-app-id",
  },

  // OAuth Configuration
  OAUTH: {
    GOOGLE: {
      CLIENT_ID: "your-google-client-id.apps.googleusercontent.com",
    },
    GITHUB: {
      CLIENT_ID: "your-github-client-id",
      CLIENT_SECRET: "your-github-client-secret",
    },
  },

  // App Configuration
  APP: {
    SCHEME: "diary-app",
  },
};

// Helper function to validate configuration
export function validateConfig() {
  const requiredFields = [
    "FIREBASE.API_KEY",
    "FIREBASE.AUTH_DOMAIN",
    "FIREBASE.PROJECT_ID",
    "OAUTH.GOOGLE.CLIENT_ID",
    "OAUTH.GITHUB.CLIENT_ID",
  ];

  const missingFields = requiredFields.filter((field) => {
    const value = field.split(".").reduce((obj, key) => obj?.[key], ENV);
    return !value || value.includes("your-");
  });

  if (missingFields.length > 0) {
    console.warn("Missing or invalid configuration fields:", missingFields);
    return false;
  }

  return true;
}
