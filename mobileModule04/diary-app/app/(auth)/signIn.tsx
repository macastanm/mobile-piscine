import { View, Text } from "../../components/Themed";
import { FontAwesome as Icon } from "@expo/vector-icons";
import { Button, useColorScheme, Alert } from "react-native";
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

WebBrowser.maybeCompleteAuthSession();

// GitHub Endpoints
const discovery = {
  authorizationEndpoint: "https://github.com/login/oauth/authorize",
  tokenEndpoint: "https://github.com/login/oauth/access_token",
  revocationEndpoint: `https://github.com/settings/connections/applications/${process.env.EXPO_PUBLIC_GITHUB_CLIENT_ID}`,
};

export default function SignIn() {
  const currentTheme = useColorScheme();

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
      const { id_token } = responseGoogle.params;
      const credential = GoogleAuthProvider.credential(id_token);
      try {
        const dataUser = await signInWithCredential(auth, credential);
      } catch (error) {
        Alert.alert("Error", "Error signing in with Google, please check if your email is nor already sing in with GitHub.");
      }
    }
  }

  async function handleResponse() {
    if (response?.type === "success") {
      const { code } = response.params;
      const { token_type, scope, access_token } = await createTokenWithCode(
        code
      );
      if (!access_token) return;
      const credential = GithubAuthProvider.credential(access_token);

      try {
        const dataUser = await signInWithCredential(auth, credential);
      } catch (error) {
        Alert.alert("Error", "Error signing in with Github, please check if your email is nor already sing in with Google.");
      }
    }
  }

  return (
    <View style={{ flex: 2, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 32, fontWeight: "bold" }}>Sign In</Text>
      <Icon.Button
        name="github"
        color={currentTheme === "dark" ? "white" : "black"}
        backgroundColor="transparent"
        size={30}
        onPress={() => {
          promptAsync();
        }}
      >
        <Text style={{ fontSize: 17, fontWeight: "500" }}>
          Sign In with Github
        </Text>
      </Icon.Button>
      <Icon.Button
        name="google"
        color={currentTheme === "dark" ? "white" : "black"}
        backgroundColor="transparent"
        size={30}
        onPress={() => {
          promptAsyncGoogle();
        }}
      >
        <Text style={{ fontSize: 17, fontWeight: "500" }}>
          Sign In with Google
        </Text>
      </Icon.Button>
    </View>
  );
}
