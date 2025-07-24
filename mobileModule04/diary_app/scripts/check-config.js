#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

// Read the env.ts file
const envPath = path.join(__dirname, "../config/env.ts");
const envContent = fs.readFileSync(envPath, "utf8");

console.log("🔍 Checking configuration...\n");

// Check for placeholder values
const placeholders = [
  { field: "FIREBASE.API_KEY", pattern: /API_KEY:\s*"your-api-key"/ },
  {
    field: "FIREBASE.AUTH_DOMAIN",
    pattern: /AUTH_DOMAIN:\s*"your-project-id\.firebaseapp\.com"/,
  },
  { field: "FIREBASE.PROJECT_ID", pattern: /PROJECT_ID:\s*"your-project-id"/ },
  {
    field: "OAUTH.GOOGLE.CLIENT_ID",
    pattern:
      /GOOGLE:\s*{\s*CLIENT_ID:\s*"your-google-client-id\.apps\.googleusercontent\.com"/,
  },
  {
    field: "OAUTH.GITHUB.CLIENT_ID",
    pattern: /GITHUB:\s*{\s*CLIENT_ID:\s*"your-github-client-id"/,
  },
];

const missingFields = [];

placeholders.forEach(({ field, pattern }) => {
  if (pattern.test(envContent)) {
    missingFields.push(field);
    console.log(`❌ ${field} - Not configured`);
  } else {
    console.log(`✅ ${field} - Configured`);
  }
});

console.log("\n📋 Summary:");
if (missingFields.length === 0) {
  console.log("🎉 All configuration fields are set!");
} else {
  console.log(`⚠️  ${missingFields.length} field(s) need to be configured:`);
  missingFields.forEach((field) => console.log(`   - ${field}`));
  console.log(
    "\n📖 Please follow the setup instructions in AUTHENTICATION_SETUP.md"
  );
  console.log("🔗 Quick links:");
  console.log("   - Firebase Console: https://console.firebase.google.com/");
  console.log("   - Google Cloud Console: https://console.cloud.google.com/");
  console.log(
    "   - GitHub Developer Settings: https://github.com/settings/developers"
  );
}
