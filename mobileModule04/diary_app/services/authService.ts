import {
  signInWithCredential,
  GoogleAuthProvider,
  OAuthProvider,
  User,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  Auth,
} from "firebase/auth";
import { auth } from "@/config/firebase";
import { ENV, validateConfig } from "@/config/env";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import * as Crypto from "expo-crypto";

// Complete the auth session
WebBrowser.maybeCompleteAuthSession();

// Google OAuth configuration
const googleConfig = {
  clientId: ENV.OAUTH.GOOGLE.CLIENT_ID,
  scopes: ["openid", "profile", "email"],
};

// GitHub OAuth configuration
const githubConfig = {
  clientId: ENV.OAUTH.GITHUB.CLIENT_ID,
  scopes: ["read:user", "user:email"],
};

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  providerId: string;
}

export class AuthService {
  private auth: Auth;

  constructor() {
    this.auth = auth;
  }

  // Convert Firebase User to our AuthUser interface
  private convertUser(user: User): AuthUser {
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      providerId: user.providerData[0]?.providerId || "unknown",
    };
  }

  // Sign in with Google
  async signInWithGoogle(): Promise<AuthUser> {
    // Validate configuration first
    if (!validateConfig()) {
      throw new Error(
        "Invalid configuration. Please check your environment variables."
      );
    }

    try {
      // Create the auth request
      const request = new AuthSession.AuthRequest({
        clientId: googleConfig.clientId,
        scopes: googleConfig.scopes,
        redirectUri: AuthSession.makeRedirectUri({
          scheme: ENV.APP.SCHEME,
        }),
        responseType: AuthSession.ResponseType.Code,
        extraParams: {
          access_type: "offline",
        },
      });

      // Get the authorization URL with Google's authorization endpoint
      const authUrl = await request.makeAuthUrlAsync({
        authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
      });

      // Open the browser for authentication
      const result = await WebBrowser.openAuthSessionAsync(
        authUrl,
        request.redirectUri
      );

      if (result.type === "success" && result.url) {
        // Exchange the code for tokens
        const tokenResult = await request.exchangeCodeAsync(result.url, {
          clientId: googleConfig.clientId,
          clientSecret: "", // Not needed for mobile apps
          tokenEndpoint: "https://oauth2.googleapis.com/token",
        });

        if (tokenResult.accessToken) {
          // Create credential and sign in
          const credential = GoogleAuthProvider.credential(
            tokenResult.accessToken
          );
          const userCredential = await signInWithCredential(
            this.auth,
            credential
          );
          return this.convertUser(userCredential.user);
        }
      }

      throw new Error("Google sign-in was cancelled or failed");
    } catch (error) {
      console.error("Google sign-in error:", error);

      // Provide more specific error messages
      if (error instanceof Error) {
        if (error.message.includes("authorizationEndpoint")) {
          throw new Error(
            "Google OAuth configuration error. Please check your Google Client ID."
          );
        }
        if (error.message.includes("Invalid client")) {
          throw new Error(
            "Invalid Google Client ID. Please check your OAuth configuration."
          );
        }
        if (error.message.includes("redirect_uri_mismatch")) {
          throw new Error(
            "Redirect URI mismatch. Please check your OAuth app configuration."
          );
        }
      }

      throw error;
    }
  }

  // Sign in with GitHub
  async signInWithGitHub(): Promise<AuthUser> {
    // Validate configuration first
    if (!validateConfig()) {
      throw new Error(
        "Invalid configuration. Please check your environment variables."
      );
    }

    try {
      // Create the auth request
      const request = new AuthSession.AuthRequest({
        clientId: githubConfig.clientId,
        scopes: githubConfig.scopes,
        redirectUri: AuthSession.makeRedirectUri({
          scheme: ENV.APP.SCHEME,
        }),
        responseType: AuthSession.ResponseType.Code,
      });

      // Get the authorization URL
      const authUrl = await request.makeAuthUrlAsync({
        authorizationEndpoint: "https://github.com/login/oauth/authorize",
      });

      // Open the browser for authentication
      const result = await WebBrowser.openAuthSessionAsync(
        authUrl,
        request.redirectUri
      );

      if (result.type === "success" && result.url) {
        // Exchange the code for tokens
        const tokenResult = await request.exchangeCodeAsync(result.url, {
          clientId: githubConfig.clientId,
          clientSecret: ENV.OAUTH.GITHUB.CLIENT_SECRET,
          tokenEndpoint: "https://github.com/login/oauth/access_token",
        });

        if (tokenResult.accessToken) {
          // Create credential and sign in
          const credential = OAuthProvider.credential(
            "github.com",
            tokenResult.accessToken
          );
          const userCredential = await signInWithCredential(
            this.auth,
            credential
          );
          return this.convertUser(userCredential.user);
        }
      }

      throw new Error("GitHub sign-in was cancelled or failed");
    } catch (error) {
      console.error("GitHub sign-in error:", error);

      // Provide more specific error messages
      if (error instanceof Error) {
        if (error.message.includes("Invalid client")) {
          throw new Error(
            "Invalid GitHub Client ID. Please check your OAuth configuration."
          );
        }
        if (error.message.includes("redirect_uri_mismatch")) {
          throw new Error(
            "Redirect URI mismatch. Please check your GitHub OAuth app configuration."
          );
        }
      }

      throw error;
    }
  }

  // Sign out
  async signOut(): Promise<void> {
    try {
      await firebaseSignOut(this.auth);
    } catch (error) {
      console.error("Sign out error:", error);
      throw error;
    }
  }

  // Get current user
  getCurrentUser(): AuthUser | null {
    const user = this.auth.currentUser;
    return user ? this.convertUser(user) : null;
  }

  // Listen to auth state changes
  onAuthStateChanged(callback: (user: AuthUser | null) => void): () => void {
    return onAuthStateChanged(this.auth, (user) => {
      callback(user ? this.convertUser(user) : null);
    });
  }
}

export const authService = new AuthService();
