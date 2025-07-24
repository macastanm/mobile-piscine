// Environment configuration for Firebase and OAuth
// Replace these values with your actual credentials

export const ENV = {
  // Firebase Configuration
  FIREBASE: {
    API_KEY: "AIzaSyCpXyXlYAPTOZtND9QXUGmFX921XG9VHU8",
    AUTH_DOMAIN: "diary-app-5849d.firebaseapp.com",
    PROJECT_ID: "diary-app-5849d",
    STORAGE_BUCKET: "diary-app-5849d.firebasestorage.app",
    MESSAGING_SENDER_ID: "272317801765",
    APP_ID: "1:272317801765:web:792534935f9528f05fa6cc",
  },

  // OAuth Configuration
  OAUTH: {
    GOOGLE: {
      CLIENT_ID: "798358157436-s0rq723ejbppl344di6dt4oip27msfv1.apps.googleusercontent.com",
    },
    GITHUB: {
      CLIENT_ID: "Ov23liFHjFqVeuHylJbW",
      CLIENT_SECRET: "6a74d980255c99f898e7f3fad80453b7c9677842",
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
    console.warn("Please follow the setup instructions in AUTHENTICATION_SETUP.md");
    return false;
  }

  return true;
}
