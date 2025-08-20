import { View, Text } from "../../components/Themed";
import { FontAwesome as Icon } from "@expo/vector-icons";
import {
  Button,
  useColorScheme,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import * as WebBrowser from "expo-web-browser";
import { useAuthRequest, makeRedirectUri } from "expo-auth-session";
import * as React from "react";
import { createTokenWithCode } from "@/utils/createTokenWithCode";
import {
  GithubAuthProvider,
  signInWithCredential,
  GoogleAuthProvider,
  onAuthStateChanged,
} from "firebase/auth";
import * as Google from "expo-auth-session/providers/google";
import { auth } from "@/firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";

WebBrowser.maybeCompleteAuthSession();

// GitHub Endpoints
const discovery = {
  authorizationEndpoint: "https://github.com/login/oauth/authorize",
  tokenEndpoint: "https://github.com/login/oauth/access_token",
  revocationEndpoint: `https://github.com/settings/connections/applications/${process.env.EXPO_PUBLIC_GITHUB_CLIENT_ID}`,
};

const { width } = Dimensions.get("window");

export default function SignIn() {
  const currentTheme = useColorScheme();
  const [isLoading, setIsLoading] = useState(false);

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: process.env.EXPO_PUBLIC_GITHUB_CLIENT_ID!,
      scopes: ["identity", "user:email"],
      redirectUri: makeRedirectUri(),
      usePKCE: false,
    },
    discovery
  );

  const [requestGoogle, responseGoogle, promptAsyncGoogle] =
    Google.useAuthRequest({
      iosClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_IOS!,
      androidClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_ANDROID!,
    });

  React.useEffect(() => {
    handleResponse();
  }, [response]);

  React.useEffect(() => {
    handleResponseGoogle();
  }, [responseGoogle]);

  async function handleResponseGoogle() {
    if (responseGoogle?.type === "success") {
      setIsLoading(true);
      const { id_token } = responseGoogle.params;
      const credential = GoogleAuthProvider.credential(id_token);
      try {
        const dataUser = await signInWithCredential(auth, credential);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        Alert.alert(
          "Error",
          "Error signing in with Google, please check if your email is nor already sing in with GitHub."
        );
      }
    }
  }

  async function handleResponse() {
    if (response?.type === "success") {
      setIsLoading(true);
      const { code } = response.params;
      const { token_type, scope, access_token } = await createTokenWithCode(
        code
      );
      if (!access_token) {
        setIsLoading(false);
        return;
      }
      const credential = GithubAuthProvider.credential(access_token);

      try {
        const dataUser = await signInWithCredential(auth, credential);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        Alert.alert(
          "Error",
          "Error signing in with Github, please check if your email is nor already sing in with Google."
        );
      }
    }
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 20,
    },
    header: {
      marginBottom: 60,
      alignItems: "center",
    },
    title: {
      fontSize: 36,
      fontWeight: "bold",
      marginBottom: 8,
      textAlign: "center",
    },
    subtitle: {
      fontSize: 16,
      opacity: 0.7,
      textAlign: "center",
      lineHeight: 22,
    },
    buttonContainer: {
      width: width - 40,
      marginBottom: 16,
    },
    button: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 16,
      paddingHorizontal: 24,
      borderRadius: 12,
      borderWidth: 1,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
    },
    githubButton: {
      backgroundColor: currentTheme === "dark" ? "#24292e" : "#ffffff",
      borderColor: currentTheme === "dark" ? "#444" : "#e1e5e9",
    },
    googleButton: {
      backgroundColor: currentTheme === "dark" ? "#24292e" : "#ffffff",
      borderColor: currentTheme === "dark" ? "#444" : "#e1e5e9",
    },
    buttonText: {
      fontSize: 16,
      fontWeight: "600",
      marginLeft: 12,
    },
    githubButtonText: {
      color: currentTheme === "dark" ? "#ffffff" : "#24292e",
    },
    googleButtonText: {
      color: currentTheme === "dark" ? "#ffffff" : "#24292e",
    },
    loadingContainer: {
      marginTop: 30,
      alignItems: "center",
    },
    loadingText: {
      marginTop: 12,
      fontSize: 14,
      opacity: 0.7,
    },
    icon: {
      fontSize: 20,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>
          Sign in to your account to continue your journey
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.githubButton]}
          onPress={() => promptAsync()}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          <Icon
            name="github"
            style={[
              styles.icon,
              { color: currentTheme === "dark" ? "#ffffff" : "#24292e" },
            ]}
          />
          <Text style={[styles.buttonText, styles.githubButtonText]}>
            Continue with GitHub
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.googleButton]}
          onPress={() => promptAsyncGoogle()}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          <Icon
            name="google"
            style={[
              styles.icon,
              { color: currentTheme === "dark" ? "#ffffff" : "#24292e" },
            ]}
          />
          <Text style={[styles.buttonText, styles.googleButtonText]}>
            Continue with Google
          </Text>
        </TouchableOpacity>
      </View>

      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="large"
            color={currentTheme === "dark" ? "#ffffff" : "#24292e"}
          />
          <Text style={styles.loadingText}>Signing you in...</Text>
        </View>
      )}
    </View>
  );
}
