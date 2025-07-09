import React, { useState, useEffect } from "react";
import { StyleSheet, TouchableOpacity, Alert, View } from "react-native";
import { router } from "expo-router";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useAuth } from "@/hooks/useAuth";
import { Ionicons } from "@expo/vector-icons";

export default function AuthOptionsScreen() {
  const colorScheme = useColorScheme();
  const {
    isAuthenticated,
    isLoading: authLoading,
    signInWithGoogle,
    signInWithGitHub,
  } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);

  useEffect(() => {
    // If user is already authenticated, redirect to diary
    if (isAuthenticated) {
      router.replace("/(tabs)");
    }
  }, [isAuthenticated]);

  const handleGoogleSignIn = async () => {
    try {
      setLoadingProvider("google");
      await signInWithGoogle();
      router.replace("/(tabs)");
    } catch (error) {
      Alert.alert("Error", "Failed to sign in with Google. Please try again.");
    } finally {
      setLoadingProvider(null);
    }
  };

  const handleGitHubSignIn = async () => {
    try {
      setLoadingProvider("github");
      await signInWithGitHub();
      router.replace("/(tabs)");
    } catch (error) {
      Alert.alert("Error", "Failed to sign in with GitHub. Please try again.");
    } finally {
      setLoadingProvider(null);
    }
  };

  const handleBackToLogin = () => {
    router.back();
  };

  // Show loading screen while checking authentication status
  if (authLoading) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Loading...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.content}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackToLogin}>
          <Ionicons
            name="arrow-back"
            size={24}
            color={Colors[colorScheme ?? "light"].text}
          />
        </TouchableOpacity>

        <ThemedView style={styles.header}>
          <ThemedText type="title" style={styles.title}>
            Choose Sign In Method
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            Select your preferred way to access your diary
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.buttonContainer}>
          {/* Google Sign In Button */}
          <TouchableOpacity
            style={[
              styles.authButton,
              styles.googleButton,
              loadingProvider === "google" && styles.disabledButton,
            ]}
            onPress={handleGoogleSignIn}
            disabled={isLoading || loadingProvider === "google"}
            activeOpacity={0.8}
          >
            <Ionicons name="logo-google" size={24} color="#fff" />
            <ThemedText style={styles.buttonText}>
              {loadingProvider === "google"
                ? "Signing in..."
                : "Continue with Google"}
            </ThemedText>
          </TouchableOpacity>

          {/* GitHub Sign In Button */}
          <TouchableOpacity
            style={[
              styles.authButton,
              styles.githubButton,
              loadingProvider === "github" && styles.disabledButton,
            ]}
            onPress={handleGitHubSignIn}
            disabled={isLoading || loadingProvider === "github"}
            activeOpacity={0.8}
          >
            <Ionicons name="logo-github" size={24} color="#fff" />
            <ThemedText style={styles.buttonText}>
              {loadingProvider === "github"
                ? "Signing in..."
                : "Continue with GitHub"}
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>

        <ThemedView style={styles.footer}>
          <ThemedText style={styles.footerText}>
            By continuing, you agree to our Terms of Service and Privacy Policy
          </ThemedText>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  content: {
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
  },
  backButton: {
    position: "absolute",
    top: -60,
    left: 0,
    padding: 10,
  },
  header: {
    alignItems: "center",
    marginBottom: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    opacity: 0.7,
    lineHeight: 24,
  },
  buttonContainer: {
    width: "100%",
    gap: 16,
  },
  authButton: {
    width: "100%",
    height: 56,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  googleButton: {
    backgroundColor: "#4285F4",
  },
  githubButton: {
    backgroundColor: "#24292e",
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    marginTop: 40,
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    textAlign: "center",
    opacity: 0.6,
    lineHeight: 18,
  },
});
